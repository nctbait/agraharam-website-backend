// src/main/java/.../service/EventCheckInSearchService.java
package org.agraharam.service;

import java.util.List;

import org.agraharam.dto.CheckinSearchRow;
import org.agraharam.dto.CheckinSearchRowView;
import org.agraharam.dto.CheckinToggleDTO;
import org.agraharam.model.EventAttendance;
import org.agraharam.repository.EventAttendanceRepository;
import org.agraharam.repository.EventRegistrationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EventCheckInSearchService {

  private final EventRegistrationRepository regRepo;
  private final EventAttendanceRepository attendanceRepo;
  private final AuditLogService auditLogService;

  public EventCheckInSearchService(EventRegistrationRepository regRepo,
                                   EventAttendanceRepository attendanceRepo,
                                   AuditLogService auditLogService) {
    this.regRepo = regRepo;
    this.attendanceRepo = attendanceRepo;
    this.auditLogService = auditLogService;
  }

  @Transactional(readOnly = true)
  public Page<CheckinSearchRowView> search(Long eventId, String q, Pageable pageable) {
    return regRepo.searchPeople(eventId, (q == null ? "" : q.trim()), pageable);
  }

  @Transactional
  public int toggle(Long eventId, List<CheckinToggleDTO> updates, String actor) {
    int inserted = 0, deleted = 0;
    for (var u : updates) {
      var type = EventAttendance.PersonType.valueOf(u.personType());
      if (u.checkedIn()) {
        if (u.attendeeId() == null) {
          var a = new EventAttendance();
          a.setEventId(eventId);
          a.setRegistrationId(u.registrationId());
          a.setPersonType(type);
          a.setSourceId(u.sourceId());
          a.setName(u.name());
          a.setRelation(u.relation());
          a.setCheckedIn(true);
          a.setCheckedInAt(java.time.OffsetDateTime.now());
          attendanceRepo.save(a);
          inserted++;
        }
      } else if (u.attendeeId() != null) {
        attendanceRepo.deleteById(u.attendeeId());
        deleted++;
      }
    }
    auditLogService.log("EVENT_CHECKIN_TOGGLE", actor, "Event",
        eventId.toString(), "Inserted: " + inserted + ", Deleted: " + deleted);
    return inserted + deleted;
  }
}

