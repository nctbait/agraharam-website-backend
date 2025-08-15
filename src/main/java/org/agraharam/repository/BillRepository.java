package org.agraharam.repository;

import java.time.LocalDate;
import java.util.List;

import org.agraharam.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByMemberIdIn(List<Long> memberIds);

    List<Bill> findByStatus(String status);

    long countByStatusIgnoreCase(String string);

    @Query("""
                select b from Bill b
                where lower(b.status) = 'approved'
                  and b.eventId = :eventId
            """)
    List<Bill> findApprovedByEvent(@Param("eventId") Long eventId);

    @Query("""
                SELECT b
                FROM Bill b
                WHERE LOWER(b.status) = 'approved'
                  AND b.submittedDate BETWEEN :from AND :to
            """)
    List<Bill> findApprovedBetween(@Param("from") LocalDate from,
            @Param("to") LocalDate to);

}
