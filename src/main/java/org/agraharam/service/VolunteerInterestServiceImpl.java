package org.agraharam.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.agraharam.dto.VolunteerInterestRequest;
import org.agraharam.model.User;
import org.agraharam.model.VolunteerCommittee;
import org.agraharam.model.VolunteerInterest;
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
                        all.add(new VolunteerInterest(r.getMemberId(), r.getRelationship(), null, committee, LocalDateTime.now(), familyId));
                    } else {
                        for (Long eventId : eventIds) {
                            all.add(new VolunteerInterest(r.getMemberId(), r.getRelationship(), eventId, committee, LocalDateTime.now(), familyId));
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
        
        repository.saveAll(all);
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

}
