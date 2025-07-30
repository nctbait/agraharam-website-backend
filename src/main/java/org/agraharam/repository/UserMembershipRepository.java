package org.agraharam.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.agraharam.model.UserMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserMembershipRepository extends JpaRepository<UserMembership, Long> {
    List<UserMembership> findByUserIdAndStatus(Long userId, String status);

    Optional<UserMembership> findTopByUserIdAndStatusOrderByStartDateDesc(Long userId, String status);

    List<UserMembership> findByStatus(String status);

    Optional<UserMembership> findTopByUserIdAndStatusAndEndDateAfterOrderByStartDateDesc(Long userId, String status,
            LocalDate endDate);

    @Query("""
            SELECT m FROM UserMembership m
            WHERE m.user.id = :userId
              AND m.status = 'active'
              AND (m.endDate IS NULL OR m.endDate >= :today)
            ORDER BY m.startDate DESC
            """)
            List<UserMembership> findCurrentMembership( Long userId, LocalDate today);

}
