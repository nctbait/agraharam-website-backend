package org.agraharam.repository;

import java.util.List;

import org.agraharam.dto.VolunteerHourSummaryDTO;
import org.agraharam.dto.VolunteerHourYearlyDTO;
import org.agraharam.model.VolunteerHour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface VolunteerHourRepository extends JpaRepository<VolunteerHour, Long> {

  @Query(value = """
              SELECT
        base.memberId,
        base.relationship,
        base.name,
        COALESCE(SUM(CASE WHEN v.status = 'approved' THEN v.hours ELSE 0 END), 0) AS approvedHours,
        COALESCE(SUM(CASE WHEN v.status = 'pending' THEN v.hours ELSE 0 END), 0) AS pendingHours
      FROM (
      (
        SELECT
          u.id AS memberId,
          'Primary' AS relationship,
          CONCAT(u.first_name, ' ', u.last_name) AS name
        FROM user u
        WHERE u.family_id = :familyId AND u.role = 'primary'
      )
      UNION ALL
      (
        SELECT
          u.id AS memberId,
          'Spouse' AS relationship,
          CONCAT(u.first_name, ' ', u.last_name) AS name
        FROM user u
        WHERE u.family_id = :familyId AND u.role != 'primary'
      )
      UNION ALL
      (
        SELECT
          f.id AS memberId,
          f.relation AS relationship,
          f.name AS name
        FROM family_member f
        WHERE f.family_id = :familyId
      )

      ) base
      LEFT JOIN volunteer_hour v
        ON v.member_id = base.memberId AND v.relationship = base.relationship
      GROUP BY base.memberId, base.relationship, base.name

              """, nativeQuery = true)
  List<VolunteerHourSummaryDTO> getFamilyHourSummary(@Param("familyId") Long familyId);

  List<VolunteerHour> findByStatus(String string);

  @Query("""
        SELECT new org.agraharam.dto.VolunteerHourYearlyDTO(
          v.memberId,
          v.relationship,
          CASE
            WHEN v.relationship IN ('Primary', 'Spouse') THEN CONCAT(u.firstName, ' ', u.lastName)
            ELSE f.name
          END,
          YEAR(v.date),
          SUM(v.hours)
        )
        FROM VolunteerHour v
        LEFT JOIN User u ON v.memberId = u.id AND v.relationship IN ('Primary', 'Spouse')
        LEFT JOIN FamilyMember f ON v.memberId = f.id AND v.relationship NOT IN ('Primary', 'Spouse')
        WHERE v.status = 'approved' AND v.familyId = :familyId
        GROUP BY v.memberId, v.relationship, YEAR(v.date), u.firstName, u.lastName, f.name
        ORDER BY v.memberId, YEAR(v.date) DESC
      """)
  List<VolunteerHourYearlyDTO> findYearlySummaryByFamilyId(@Param("familyId") Long familyId);

}
