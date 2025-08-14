package org.agraharam.repository;

import org.agraharam.model.EventAttendance;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface EventAttendanceRepository extends JpaRepository<EventAttendance, Long> {

    List<EventAttendance> findByEventId(Long eventId);

    List<EventAttendance> findByRegistrationId(Long registrationId);

    List<EventAttendance> findByRegistrationIdIn(Collection<Long> registrationIds);

    @Modifying
    @Query("UPDATE EventAttendance ea SET ea.checkedIn = :checked, ea.checkedInAt = CASE WHEN :checked = true THEN CURRENT_TIMESTAMP ELSE NULL END " +
           "WHERE ea.id IN :ids")
    int bulkSetChecked(@Param("ids") Collection<Long> ids, @Param("checked") boolean checked);

    @Query("""
      SELECT ea
      FROM EventAttendance ea
      WHERE ea.eventId = :eventId
        AND (
              LOWER(ea.name) LIKE LOWER(CONCAT('%', :q, '%'))
           OR EXISTS (
                  SELECT 1 FROM EventRegistration r
                  WHERE r.id = ea.registrationId
                    AND LOWER(r.user.email) LIKE LOWER(CONCAT('%', :q, '%'))
              )
        )
    """)
    List<EventAttendance> searchByEventAndQuery(@Param("eventId") Long eventId, @Param("q") String query);
}
