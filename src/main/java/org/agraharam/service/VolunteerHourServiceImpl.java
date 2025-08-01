package org.agraharam.service;

import java.time.LocalDateTime;
import java.util.List;

import org.agraharam.dto.PendingVolunteerHourDTO;
import org.agraharam.dto.VolunteerHourRequest;
import org.agraharam.dto.VolunteerHourSummaryDTO;
import org.agraharam.dto.VolunteerHourYearlyDTO;
import org.agraharam.model.FamilyMember;
import org.agraharam.model.User;
import org.agraharam.model.VolunteerCommittee;
import org.agraharam.model.VolunteerHour;
import org.agraharam.repository.EventRepository;
import org.agraharam.repository.FamilyMemberRepository;
import org.agraharam.repository.UserRepository;
import org.agraharam.repository.VolunteerCommitteeRepository;
import org.agraharam.repository.VolunteerHourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VolunteerHourServiceImpl implements VolunteerHourService {
    @Autowired
    private VolunteerHourRepository repository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VolunteerCommitteeRepository committeeRepo;
    @Autowired
    private FamilyMemberRepository familyMemberRepo;
    @Autowired
    private EventRepository eventRepo;
    @Autowired
    private AuditLogServiceImpl auditLog;

    @Override
    public List<VolunteerHourSummaryDTO> getFamilyHourSummary(String email) {
        User primary = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Long familyId = primary.getFamily().getId();
        return repository.getFamilyHourSummary(familyId);
    }

    @Override
    public void saveVolunteerHour(String email, VolunteerHourRequest req) {
        User submitter = userRepository.findByEmail(email).orElseThrow();
        Long familyId = submitter.getFamily().getId();

        VolunteerHour vh = new VolunteerHour();
        vh.setMemberId(req.getMemberId());
        vh.setRelationship(req.getRelationship());
        vh.setDate(req.getDate());
        vh.setStartTime(req.getStartTime());
        vh.setHours(req.getHours());
        vh.setDescription(req.getDescription());
        vh.setFamilyId(familyId);
        vh.setStatus("pending");
        vh.setSubmittedAt(LocalDateTime.now());
        vh.setUserId(submitter.getId());

        if (req.getEventId() != null) {
            vh.setEventId(req.getEventId());
        }

        if (req.getCommitteeId() != null) {
            VolunteerCommittee committee = committeeRepo.findById(req.getCommitteeId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid committee ID"));
            vh.setCommittee(committee);
        }

        repository.save(vh);
        auditLog.log("VOLUNTEER_HOUR", email, "VolunteerHour", String.valueOf(vh.getId()), "Volunteer hour submitted:"+vh.getId());
    }

    @Override
    public List<PendingVolunteerHourDTO> getPendingVolunteerHours() {
        List<VolunteerHour> hours = repository.findByStatus("pending");

        return hours.stream().map(v -> {
            String name = switch (v.getRelationship()) {
                case "Primary", "Spouse" ->
                    userRepository.findById(v.getMemberId()).map(User::getFirstName).orElse("Unknown") + " " +
                            userRepository.findById(v.getMemberId()).map(User::getLastName).orElse("Unknown");
                default -> familyMemberRepo.findById(v.getMemberId()).map(FamilyMember::getName).orElse("Unknown");
            };

            String eventName = null;
            if (v.getEventId() != null) {
                eventName = eventRepo.getReferenceById(v.getEventId()).getTitle();
            }

            return new PendingVolunteerHourDTO(
                    v.getId(), name, v.getRelationship(), v.getDate(), v.getHours(),
                    eventName,
                    v.getCommittee() != null ? v.getCommittee().getName() : null,
                    v.getDescription());
        }).toList();
    }

    @Override
    public void updateVolunteerHourStatus(Long id, String action, String email) {
        VolunteerHour vh = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid volunteer hour ID"));

        vh.setStatus(action.equalsIgnoreCase("approve") ? "approved" : "rejected");
        repository.save(vh);
        auditLog.log("VOLUNTEER_HOUR_UPDATE", email, "VolunteerHour", 
        String.valueOf(vh.getId()), "Volunteer hour submitted:"+vh.getId() +" for action:"+action);

    }

    @Override
    public void bulkUpdateVolunteerHourStatus(List<Long> ids, String action, String email) {
        String newStatus = action.equalsIgnoreCase("approve") ? "approved" : "rejected";
        List<VolunteerHour> records = repository.findAllById(ids);
        records.forEach(v -> {
            v.setStatus(newStatus);
            auditLog.log("VOLUNTEER_HOUR_UPDATE", email, "VolunteerHour", 
            String.valueOf(v.getId()), "Volunteer hour submitted:"+v.getId() +" for action:"+action);

        });
        repository.saveAll(records);
    }

    @Override
    public List<VolunteerHourYearlyDTO> getYearlySummary(String email) {
        User primary = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Long familyId = primary.getFamily().getId();

        return repository.findYearlySummaryByFamilyId(familyId);
    }

}
