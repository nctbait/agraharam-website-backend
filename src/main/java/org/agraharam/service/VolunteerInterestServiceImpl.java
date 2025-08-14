package org.agraharam.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.agraharam.dto.CommitteeDTO;
import org.agraharam.dto.EventDTO;
import org.agraharam.dto.VolunteerInterestAdminView;
import org.agraharam.dto.VolunteerInterestRequest;
import org.agraharam.enums.Role;
import org.agraharam.model.Event;
import org.agraharam.model.User;
import org.agraharam.model.VolunteerCommittee;
import org.agraharam.model.VolunteerInterest;
import org.agraharam.repository.EventRepository;
import org.agraharam.repository.FamilyMemberRepository;
import org.agraharam.repository.UserRepository;
import org.agraharam.repository.VolunteerCommitteeRepository;
import org.agraharam.repository.VolunteerInterestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
public class VolunteerInterestServiceImpl implements VolunteerInterestService {

    @Autowired
    VolunteerInterestRepository repository;

    @Autowired
    private VolunteerCommitteeRepository committeeRepository;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private EventRepository eventRepo;

    @Autowired
    private FamilyMemberRepository familyMemRepo;

    @Autowired
    private AuditLogServiceImpl auditLogService;

    @Transactional
    public ResponseEntity<?> submitVolunteerInterest(List<VolunteerInterestRequest> requests, String email) {
        List<VolunteerInterest> all = new ArrayList<>();
        Long familyId = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"))
                .getFamily()
                .getId();
        repository.deleteByFamilyId(familyId); // clean slate
        for (VolunteerInterestRequest r : requests) {
            List<Long> committeeIds = Optional.ofNullable(r.getCommittees()).orElse(List.of());
            List<Long> eventIds = Optional.ofNullable(r.getEvents()).orElse(List.of());

            // CASE 1: Committees × Events (cross-product)
            if (!committeeIds.isEmpty()) {
                for (Long committeeId : committeeIds) {
                    VolunteerCommittee committee = committeeRepository.findById(committeeId)
                            .orElseThrow(() -> new IllegalArgumentException("Invalid committee ID: " + committeeId));

                    // If no events, still allow committee with null event
                    if (eventIds.isEmpty()) {
                        all.add(new VolunteerInterest(r.getMemberId(), r.getRelationship(), null, committee,
                                LocalDateTime.now(), familyId));
                    } else {
                        for (Long eventId : eventIds) {
                            all.add(new VolunteerInterest(r.getMemberId(), r.getRelationship(), eventId, committee,
                                    LocalDateTime.now(), familyId));
                        }
                    }
                }
            }

            // CASE 2: Events only
            if (committeeIds.isEmpty() && !eventIds.isEmpty()) {
                for (Long eventId : eventIds) {
                    VolunteerInterest v = new VolunteerInterest();
                    v.setFamilyMemberId(r.getMemberId());
                    v.setRelationship(r.getRelationship());
                    v.setEventId(eventId);
                    v.setCommittee(null); // ✅ no committee
                    v.setSubmittedAt(LocalDateTime.now());
                    v.setFamilyId(familyId);
                    all.add(v);
                }
            }
        }

        List<VolunteerInterest> list = repository.saveAll(all);
        for (VolunteerInterest each : list) {
            auditLogService.log("VOLUNTEER_INTEREST_SUBMITTED", email,
                    "VolunteerInterest", String.valueOf(each.getId()),
                    "VOLUNTEER_INTEREST_SUBMITTED by :" + email);
        }
        return ResponseEntity.ok("Submitted Volunteer Interests");
    }

    @Override
    public List<VolunteerInterestRequest> getVolunteerInterest(String email) {
        User primary = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Long familyId = primary.getFamily().getId();
        List<VolunteerInterest> interests = repository.findByFamilyId(familyId);

        // Group by memberId + relationship
        Map<String, VolunteerInterestRequest> grouped = new HashMap<>();

        for (VolunteerInterest interest : interests) {
            String key = interest.getFamilyMemberId() + "::" + interest.getRelationship();

            grouped.computeIfAbsent(key, k -> {
                VolunteerInterestRequest dto = new VolunteerInterestRequest();
                dto.setMemberId(interest.getFamilyMemberId());
                dto.setRelationship(interest.getRelationship());
                dto.setCommittees(new ArrayList<>());
                dto.setEvents(new ArrayList<>());
                return dto;
            });

            VolunteerInterestRequest dto = grouped.get(key);

            // Add committee
            if (interest.getCommittee() != null) {
                dto.getCommittees().add(interest.getCommittee().getId());
            }

            // Add event if not null and not already added
            if (interest.getEventId() != null && !dto.getEvents().contains(interest.getEventId())) {
                dto.getEvents().add(interest.getEventId());
            }
        }

        return new ArrayList<>(grouped.values());
    }

    @Override
    public List<VolunteerInterestAdminView> getAllVolunteerInterests() {
        List<VolunteerInterest> all = repository.findAll();

        Map<Long, String> eventMap = eventRepo.findAll().stream()
                .collect(Collectors.toMap(Event::getId, Event::getTitle));

        Map<Long, String> committeeMap = committeeRepository.findAll().stream()
                .collect(Collectors.toMap(VolunteerCommittee::getId, VolunteerCommittee::getName));

        Map<String, VolunteerInterestAdminView> grouped = new LinkedHashMap<>();

        for (VolunteerInterest vi : all) {
            String key = vi.getFamilyMemberId() + "-" + vi.getRelationship();

            VolunteerInterestAdminView dto = grouped.computeIfAbsent(key, k -> {
                VolunteerInterestAdminView newDto = new VolunteerInterestAdminView();
                newDto.setMemberId(vi.getFamilyMemberId());
                newDto.setRelationship(vi.getRelationship());

                if ("Primary".equalsIgnoreCase(vi.getRelationship())
                        || "Spouse".equalsIgnoreCase(vi.getRelationship())) {
                    userRepo.findById(vi.getFamilyMemberId()).ifPresent(user -> {
                        newDto.setMemberName(user.getFirstName() + " " + user.getLastName());
                        newDto.setEmail(user.getEmail());
                        newDto.setPhone(user.getPhoneNumber());
                    });
                } else {
                    familyMemRepo.findById(vi.getFamilyMemberId()).ifPresent(child -> {
                        newDto.setMemberName(child.getName() + " (Age " + child.getAge() + ")");
                    });

                    // Fetch primary's phone/email via familyId
                    userRepo.findByFamilyIdAndRole(vi.getFamilyId(), Role.primary).ifPresent(primary -> {
                        newDto.setPhone(primary.getPhoneNumber());
                        // optional: dto.setEmail(primary.getEmail());
                    });
                }

                return newDto;
            });

            // Add event
            if (vi.getEventId() != null) {
                eventRepo.findById(vi.getEventId()).ifPresent(event -> {
                    EventDTO edto = new EventDTO(
                            event.getId(),
                            event.getTitle(),
                            event.getDate(),
                            event.getLocation(), 
                            event.getRegistrationDeadline(), 
                            event.getCapacity());
                    dto.getEvents().add(edto);
                });
            }

            // Add committee
            if (vi.getCommittee() != null) {
                CommitteeDTO cdto = new CommitteeDTO();
                cdto.setId(vi.getCommittee().getId());
                cdto.setName(committeeMap.getOrDefault(vi.getCommittee().getId(), "Unknown"));
                dto.getCommittees().add(cdto);
            }
        }

        return new ArrayList<>(grouped.values());
    }

}
