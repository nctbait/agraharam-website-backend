package org.agraharam.repository;

import java.util.Collection;
import java.util.List;

import org.agraharam.dto.CheckinSearchRowView;
import org.agraharam.enums.EventStatus;
import org.agraharam.model.EventRegistration;
import org.agraharam.model.Family;
import org.agraharam.model.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
        List<EventRegistration> findByUser(User user);

        List<EventRegistration> findByUser_Family(Family family);

        @Query("SELECT u FROM User u JOIN EventRegistration r ON u.id = r.user.id WHERE r.event.id = :eventId AND r.status = 'CONFIRMED'")
        List<User> findRegisteredUsers(Long eventId);

        List<EventRegistration> findByUser_FamilyAndStatus(Family family, EventStatus status);

        List<EventRegistration> findByEvent_Id(Long eventId);

        // EventRegistrationRepository
        @EntityGraph(attributePaths = { "user", "users" })
        List<EventRegistration> findByEvent_IdAndStatus(Long eventId, EventStatus status);

        @Query("""
                           SELECT DISTINCT r.id
                           FROM EventRegistration r
                           LEFT JOIN r.user u
                           LEFT JOIN r.users us
                           LEFT JOIN r.familyMembers fm
                           LEFT JOIN r.guests g
                           WHERE r.event.id = :eventId
                             AND (
                                  LOWER(CONCAT(COALESCE(u.firstName,''), ' ', COALESCE(u.lastName,''))) LIKE LOWER(CONCAT('%', :q, '%'))
                               OR LOWER(COALESCE(u.email, '')) LIKE LOWER(CONCAT('%', :q, '%'))
                               OR LOWER(CONCAT(COALESCE(us.firstName,''), ' ', COALESCE(us.lastName,''))) LIKE LOWER(CONCAT('%', :q, '%'))
                               OR LOWER(COALESCE(fm.name, '')) LIKE LOWER(CONCAT('%', :q, '%'))
                               OR LOWER(COALESCE(g.name, ''))  LIKE LOWER(CONCAT('%', :q, '%'))
                             )
                        """)
        List<Long> findRegistrationIdsByEventAndQuery(@Param("eventId") Long eventId,
                        @Param("q") String query);

        List<EventRegistration> findByEvent_IdAndStatusIn(Long eventId, Collection<EventStatus> status);

        @EntityGraph(attributePaths = { "user", "users" })
        List<EventRegistration> findWithPeopleByEvent_IdAndStatusIn(Long eventId, Collection<EventStatus> status);

        @Query(
    value = """
    SELECT * FROM (
      SELECT
        er.id  AS registration_id,
        er.event_id AS event_id,
        'PRIMARY_USER' AS person_type,
        u.id AS source_id,
        TRIM(CONCAT(COALESCE(u.first_name,''),' ',COALESCE(u.last_name,''))) AS name,
        CASE
          WHEN LOWER(u.role)='primary' THEN 'Primary'
          WHEN LOWER(u.role)='spouse'  THEN 'Spouse'
          ELSE COALESCE(u.role,'')
        END AS relation,
        CASE WHEN a.id IS NULL THEN 0 ELSE 1 END AS checked_in_raw,
        a.id AS attendee_id
      FROM event_registration er
      JOIN user u ON u.id = er.user_id
      LEFT JOIN event_attendance a
        ON a.event_id = er.event_id
       AND a.registration_id = er.id
       AND a.person_type = 'PRIMARY_USER'
       AND a.source_id = u.id
      WHERE er.status = 'CONFIRMED'
        AND er.event_id = :eventId
        AND (:q IS NULL OR :q = '' OR
             LOWER(TRIM(CONCAT(COALESCE(u.first_name,''),' ',COALESCE(u.last_name,''))))
             LIKE LOWER(CONCAT('%', :q, '%')))

      UNION ALL
      SELECT
        er.id  AS registration_id,
        er.event_id AS event_id,
        'USER' AS person_type,
        u2.id AS source_id,
        TRIM(CONCAT(COALESCE(u2.first_name,''),' ',COALESCE(u2.last_name,''))) AS name,
        CASE
          WHEN LOWER(u2.role)='spouse'  THEN 'Spouse'
          WHEN LOWER(u2.role)='primary' THEN 'Primary'
          ELSE COALESCE(u2.role,'')
        END AS relation,
        CASE WHEN a.id IS NULL THEN 0 ELSE 1 END AS checked_in_raw,
        a.id AS attendee_id
      FROM event_registration er
      JOIN event_registration_users eru ON eru.event_registration_id = er.id
      JOIN user u2 ON u2.id = eru.users_id
      LEFT JOIN event_attendance a
        ON a.event_id = er.event_id
       AND a.registration_id = er.id
       AND a.person_type = 'USER'
       AND a.source_id = u2.id
      WHERE er.status = 'CONFIRMED'
        AND er.event_id = :eventId
        AND u2.id <> er.user_id
        AND (:q IS NULL OR :q = '' OR
             LOWER(TRIM(CONCAT(COALESCE(u2.first_name,''),' ',COALESCE(u2.last_name,''))))
             LIKE LOWER(CONCAT('%', :q, '%')))

      UNION ALL
      SELECT
        er.id  AS registration_id,
        er.event_id AS event_id,
        'FAMILY_MEMBER' AS person_type,
        fm.id AS source_id,
        TRIM(COALESCE(fm.name,'')) AS name,
        COALESCE(fm.relation,'')   AS relation,
        CASE WHEN a.id IS NULL THEN 0 ELSE 1 END AS checked_in_raw,
        a.id AS attendee_id
      FROM event_registration er
      JOIN event_registration_family_members erf ON erf.event_registration_id = er.id
      JOIN family_member fm ON fm.id = erf.family_members_id
      LEFT JOIN event_attendance a
        ON a.event_id = er.event_id
       AND a.registration_id = er.id
       AND a.person_type = 'FAMILY_MEMBER'
       AND a.source_id = fm.id
      WHERE er.status = 'CONFIRMED'
        AND er.event_id = :eventId
        AND (:q IS NULL OR :q = '' OR LOWER(fm.name) LIKE LOWER(CONCAT('%', :q, '%')))

      UNION ALL
      SELECT
        er.id  AS registration_id,
        er.event_id AS event_id,
        'GUEST' AS person_type,
        g.id AS source_id,
        TRIM(COALESCE(g.name,'')) AS name,
        'Guest' AS relation,
        CASE WHEN a.id IS NULL THEN 0 ELSE 1 END AS checked_in_raw,
        a.id AS attendee_id
      FROM event_registration er
      JOIN guest g ON g.registration_id = er.id
      LEFT JOIN event_attendance a
        ON a.event_id = er.event_id
       AND a.registration_id = er.id
       AND a.person_type = 'GUEST'
       AND a.source_id = g.id
      WHERE er.status = 'CONFIRMED'
        AND er.event_id = :eventId
        AND (:q IS NULL OR :q = '' OR LOWER(g.name) LIKE LOWER(CONCAT('%', :q, '%')))
    ) people
    ORDER BY name, person_type
    """,
    countQuery = """
    SELECT COUNT(*) FROM (
      SELECT er.id
      FROM event_registration er
      JOIN user u ON u.id = er.user_id
      WHERE er.status='CONFIRMED' AND er.event_id=:eventId
        AND (:q IS NULL OR :q='' OR
             LOWER(TRIM(CONCAT(COALESCE(u.first_name,''),' ',COALESCE(u.last_name,''))))
             LIKE LOWER(CONCAT('%', :q, '%')))
      UNION ALL
      SELECT er.id
      FROM event_registration er
      JOIN event_registration_users eru ON eru.event_registration_id = er.id
      JOIN user u2 ON u2.id = eru.users_id
      WHERE er.status='CONFIRMED' AND er.event_id=:eventId AND u2.id<>er.user_id
        AND (:q IS NULL OR :q='' OR
             LOWER(TRIM(CONCAT(COALESCE(u2.first_name,''),' ',COALESCE(u2.last_name,''))))
             LIKE LOWER(CONCAT('%', :q, '%')))
      UNION ALL
      SELECT er.id
      FROM event_registration er
      JOIN event_registration_family_members erf ON erf.event_registration_id = er.id
      JOIN family_member fm ON fm.id = erf.family_members_id
      WHERE er.status='CONFIRMED' AND er.event_id=:eventId
        AND (:q IS NULL OR :q='' OR LOWER(fm.name) LIKE LOWER(CONCAT('%', :q, '%')))
      UNION ALL
      SELECT er.id
      FROM event_registration er
      JOIN guest g ON g.registration_id = er.id
      WHERE er.status='CONFIRMED' AND er.event_id=:eventId
        AND (:q IS NULL OR :q='' OR LOWER(g.name) LIKE LOWER(CONCAT('%', :q, '%')))
    ) c
    """,
    nativeQuery = true
  )
  org.springframework.data.domain.Page<CheckinSearchRowView> searchPeople(
      @Param("eventId") Long eventId,
      @Param("q") String q,
      org.springframework.data.domain.Pageable pageable
  );

}
