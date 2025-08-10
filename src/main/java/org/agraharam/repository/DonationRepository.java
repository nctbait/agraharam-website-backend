package org.agraharam.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.agraharam.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByStatus(String status);

    List<Donation> findByUserIdIn(List<Long> userIds);

    @Query("SELECT YEAR(d.submittedAt), SUM(d.amount) FROM Donation d WHERE d.userId IN :userIds AND d.status = 'approved' GROUP BY YEAR(d.submittedAt)")
    List<Object[]> getApprovedDonationsByYear(@Param("userIds") List<Long> userIds);

    long countByStatusIgnoreCase(String string);
    
    @Query("select coalesce(sum(d.amount),0) from Donation d where lower(d.status)=lower(:status) and d.submittedAt between :atStartOfDay and :atTime")
    Double sumAmountByStatusAndSubmittedAtBetween(String status, LocalDateTime atStartOfDay, LocalDateTime atTime);

    @Query("""
        select d from Donation d
        where lower(d.status) = 'approved'
          and d.submittedAt between :start and :end
    """)
    List<Donation> findByStatusApprovedBetween(@Param("start") LocalDateTime start,
                                               @Param("end") LocalDateTime end);

    List<Donation> findByFamilyIdAndStatusAndSubmittedAtBetween(Long id, String string, LocalDateTime atStartOfDay,
            LocalDateTime atTime);

}
