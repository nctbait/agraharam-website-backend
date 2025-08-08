package org.agraharam.repository;

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

}
