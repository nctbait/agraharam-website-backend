package org.agraharam.service;

import lombok.RequiredArgsConstructor;
import org.agraharam.dto.AttendeeDTO;
import org.agraharam.dto.CheckInUpdateDTO;
import org.agraharam.dto.RegistrationAttendeesDTO;
import org.agraharam.enums.EventStatus;
import org.agraharam.model.EventAttendance;
import org.agraharam.model.EventRegistration;
import org.agraharam.repository.EventAttendanceRepository;
import org.agraharam.repository.EventRegistrationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventCheckInService {

    private final EventRegistrationRepository registrationRepo;
    private final EventAttendanceRepository attendanceRepo;
    private final AuditLogService auditLogService;

    /**
     * Ensure EventAttendance rows exist for all people under each registration of
     * the event.
     * Safe to call repeatedly (idempotent).
     */
    // EventCheckInService

    // EventCheckInService
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void ensureAttendanceRows(Long eventId) {
        // ✅ Only confirmed regs
        List<EventRegistration> regs = registrationRepo.findByEvent_IdAndStatus(eventId, EventStatus.CONFIRMED);
        if (regs.isEmpty())
            return;

        List<Long> regIds = regs.stream().map(EventRegistration::getId).toList();

        Map<Long, List<EventAttendance>> existingByReg = attendanceRepo
                .findByRegistrationIdIn(regIds)
                .stream()
                .collect(Collectors.groupingBy(EventAttendance::getRegistrationId));

        List<EventAttendance> toInsert = new ArrayList<>(256);

        for (EventRegistration reg : regs) {
            Long regId = reg.getId();
            var existing = existingByReg.getOrDefault(regId, List.of());

            // Track which sourceIds we've already planned to insert for this reg
            // to prevent any duplicates (e.g., primary also present in users).
            Set<String> plannedKeys = new HashSet<>();
            BiFunction<EventAttendance.PersonType, Long, String> key = (pt, srcId) -> pt.name() + "#" + srcId;

            // Primary
            Long primaryId = null;
            if (reg.getUser() != null) {
                primaryId = reg.getUser().getId();
                String relation = "primary".equalsIgnoreCase(reg.getUser().getRole().name()) ? "Primary"
                        : "spouse".equalsIgnoreCase(reg.getUser().getRole().name()) ? "Spouse"
                                : niceRole(reg.getUser().getRole().name());
                if (upsert(toInsert, existing, plannedKeys, key, eventId, regId,
                        EventAttendance.PersonType.PRIMARY_USER,
                        primaryId,
                        (safe(reg.getUser().getFirstName()) + " " + safe(reg.getUser().getLastName())).trim(),
                        relation)) {
                    plannedKeys.add(key.apply(EventAttendance.PersonType.PRIMARY_USER, primaryId));
                }
            }

            // Users (skip if same as primary or already planned)
            if (reg.getUsers() != null) {
                reg.getUsers().stream()
                        .filter(u -> u != null && u.getId() != null)
                        .filter(u -> reg.getUser() == null || !u.getId().equals(reg.getUser().getId())) // ✅ avoid primary duplicate
                        .forEach(u -> {
                            var k = key.apply(EventAttendance.PersonType.USER, u.getId());
                            if (plannedKeys.contains(k))
                                return; // ✅ avoid dup within the same pass
                            String relation = "spouse".equalsIgnoreCase(u.getRole().name()) ? "Spouse"
                                    : niceRole(u.getRole().name());
                            if (upsert(toInsert, existing, plannedKeys, key, eventId, regId,
                                    EventAttendance.PersonType.USER,
                                    u.getId(),
                                    (safe(u.getFirstName()) + " " + safe(u.getLastName())).trim(),
                                    relation)) {
                                plannedKeys.add(k);
                            }
                        });
            }

            // Family members (left lazy; add @BatchSize if needed)
            if (reg.getFamilyMembers() != null) {
                reg.getFamilyMembers().forEach(fm -> {
                    if (fm == null || fm.getId() == null)
                        return;
                    var k = key.apply(EventAttendance.PersonType.FAMILY_MEMBER, fm.getId());
                    if (plannedKeys.contains(k))
                        return;
                    if (upsert(toInsert, existing, plannedKeys, key, eventId, regId,
                            EventAttendance.PersonType.FAMILY_MEMBER,
                            fm.getId(), safe(fm.getName()), safe(fm.getRelation()))) {
                        plannedKeys.add(k);
                    }
                });
            }

            // Guests (left lazy; add @BatchSize if needed)
            if (reg.getGuests() != null) {
                reg.getGuests().forEach(g -> {
                    if (g == null || g.getId() == null)
                        return;
                    var k = key.apply(EventAttendance.PersonType.GUEST, g.getId());
                    if (plannedKeys.contains(k))
                        return;
                    if (upsert(toInsert, existing, plannedKeys, key, eventId, regId,
                            EventAttendance.PersonType.GUEST,
                            g.getId(), safe(g.getName()), "Guest")) {
                        plannedKeys.add(k);
                    }
                });
            }
        }

        if (!toInsert.isEmpty())
            attendanceRepo.saveAll(toInsert);
    }

    /**
     * List attendees (grouped by registration) for an event.
     * If {@code q} is provided, restrict to registrations where primary/extra user,
     * family, guest name,
     * or user email matches (case-insensitive).
     * If {@code onlyCheckedIn} is true, return only attendees who are checked in.
     */
    @Transactional
    public List<RegistrationAttendeesDTO> listForEvent(Long eventId, String q, Boolean onlyCheckedIn) {
        // Make sure rows exist before listing
        ensureAttendanceRows(eventId);

        List<EventAttendance> rows;

        if (q != null && !q.isBlank()) {
            // Use registration-side search so results match how admins think about
            // registrants
            List<Long> regIds = registrationRepo.findRegistrationIdsByEventAndQuery(eventId, q.trim());
            if (regIds.isEmpty())
                return List.of();
            rows = attendanceRepo.findByRegistrationIdIn(regIds);
        } else {
            rows = attendanceRepo.findByEventId(eventId);
        }

        if (Boolean.TRUE.equals(onlyCheckedIn)) {
            rows = rows.stream().filter(EventAttendance::isCheckedIn).toList();
        }

        // Group attendees by registration id
        Map<Long, List<EventAttendance>> byReg = rows.stream()
                .collect(Collectors.groupingBy(EventAttendance::getRegistrationId));

        // Fetch registrations for header info (primary name/email)
        // Use a single query then map for O(1) lookups
        Map<Long, EventRegistration> regMap = registrationRepo.findByEvent_Id(eventId)
                .stream()
                .collect(Collectors.toMap(EventRegistration::getId, Function.identity()));

        List<RegistrationAttendeesDTO> out = new ArrayList<>(byReg.size());

        for (Map.Entry<Long, List<EventAttendance>> e : byReg.entrySet()) {
            Long regId = e.getKey();
            EventRegistration reg = regMap.get(regId);

            String primaryName = "Primary";
            String primaryEmail = "";
            if (reg != null && reg.getUser() != null) {
                primaryName = (safe(reg.getUser().getFirstName()) + " " + safe(reg.getUser().getLastName())).trim();
                primaryEmail = safe(reg.getUser().getEmail());
            }

            // Sort attendees: checked-in first, then by type, then by name
            List<AttendeeDTO> attendees = e.getValue().stream()
                    .sorted(Comparator
                            .comparing(EventAttendance::isCheckedIn).reversed()
                            .thenComparing(a -> a.getPersonType().name())
                            .thenComparing(EventAttendance::getName, String.CASE_INSENSITIVE_ORDER))
                    .map(a -> new AttendeeDTO(
                            a.getId(),
                            a.getName(),
                            a.getRelation(),
                            a.getPersonType(),
                            a.isCheckedIn()))
                    .toList();

            out.add(new RegistrationAttendeesDTO(regId, primaryName, primaryEmail, attendees));
        }

        // Stable order by primary name (case-insensitive)
        out.sort(Comparator.comparing(RegistrationAttendeesDTO::primaryName, String.CASE_INSENSITIVE_ORDER));
        return out;
    }

    @Transactional
    public int applyCheckinsAndAudit(Long eventId,
            List<CheckInUpdateDTO> updates,
            String actor) {
        if (updates == null || updates.isEmpty())
            return 0;

        var toCheck = updates.stream().filter(CheckInUpdateDTO::checkedIn).map(CheckInUpdateDTO::id).toList();
        var toUncheck = updates.stream().filter(u -> !u.checkedIn()).map(CheckInUpdateDTO::id).toList();

        int n1 = applyCheckins(toCheck, true);
        int n2 = applyCheckins(toUncheck, false);

        // Load affected attendees to log who changed
        var checked = toCheck.isEmpty() ? List.<EventAttendance>of() : attendanceRepo.findAllById(toCheck);
        var unchecked = toUncheck.isEmpty() ? List.<EventAttendance>of() : attendanceRepo.findAllById(toUncheck);

        // Build concise messages (cap length)
        String checkedMsg = formatAttendeesForAudit(checked);
        String uncheckedMsg = formatAttendeesForAudit(unchecked);

        if (!checked.isEmpty()) {
            auditLogService.log("EVENT_CHECKIN_BULK", actor, "Event", eventId.toString(),
                    "Checked in (" + checked.size() + "): " + checkedMsg);
        }
        if (!unchecked.isEmpty()) {
            auditLogService.log("EVENT_CHECKIN_BULK", actor, "Event", eventId.toString(),
                    "Unchecked (" + unchecked.size() + "): " + uncheckedMsg);
        }

        return n1 + n2;
    }

    /**
     * Bulk apply check-in/checkout for the given attendance IDs.
     * Returns number of rows updated.
     */
    @Transactional
    public int applyCheckins(Collection<Long> attendeeIds, boolean checked) {
        if (attendeeIds == null || attendeeIds.isEmpty())
            return 0;
        return attendanceRepo.bulkSetChecked(attendeeIds, checked);
    }

    // -------- helpers --------

    private static String safe(String s) {
        return s == null ? "" : s;
    }


    private static String niceRole(String role) {
        if (role == null || role.isBlank())
            return "User";
        String r = role.trim().toLowerCase();
        if ("primary".equals(r))
            return "Primary";
        if ("spouse".equals(r))
            return "Spouse";
        // Title‑case fallback: "adminUser" -> "Adminuser"
        return Character.toUpperCase(r.charAt(0)) + r.substring(1);
    }

    private static String formatAttendeesForAudit(List<EventAttendance> list) {
        if (list == null || list.isEmpty())
            return "(none)";
        int limit = 25;
        var names = list.stream()
                .limit(limit)
                .map(a -> a.getName() + (a.getRelation() != null && !a.getRelation().isBlank()
                        ? " (" + a.getRelation() + ")"
                        : ""))
                .collect(java.util.stream.Collectors.joining(", "));
        if (list.size() > limit) {
            names += " … +" + (list.size() - limit) + " more";
        }
        return names;
    }

    private boolean upsert(
            List<EventAttendance> toInsert,
            List<EventAttendance> existing,
            Set<String> plannedKeys,
            BiFunction<EventAttendance.PersonType, Long, String> key,
            Long eventId,
            Long registrationId,
            EventAttendance.PersonType type,
            Long sourceId,
            String name,
            String relation) {
        if (sourceId == null)
            return false;

        // already planned?
        String k = key.apply(type, sourceId);
        if (plannedKeys.contains(k))
            return false;

        // already exists in DB?
        boolean exists = existing.stream().anyMatch(a -> a.getPersonType() == type &&
                Objects.equals(a.getSourceId(), sourceId));
        if (exists)
            return false;

        EventAttendance a = new EventAttendance();
        a.setEventId(eventId);
        a.setRegistrationId(registrationId);
        a.setPersonType(type);
        a.setSourceId(sourceId);
        a.setName(name);
        a.setRelation(relation);
        a.setCheckedIn(false);
        toInsert.add(a);
        return true;
    }

}
