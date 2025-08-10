package org.agraharam.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.agraharam.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByUserIdAndTaxDeductibleTrueAndPaymentDateBetween(
            Long userId, LocalDateTime start, LocalDateTime end);

    List<Payment> findByReferenceyTypeAndStatus(String referenceyType, String status);

    List<Payment> findByUserIdIn(List<Long> userIds);

    @Query("SELECT YEAR(p.paymentDate), SUM(p.amount) FROM Payment p WHERE p.user.id IN :userIds AND p.paymentType = 'user_membership' AND p.status = 'approved' AND p.taxDeductible = true GROUP BY YEAR(p.paymentDate)")
    List<Object[]> getApprovedMembershipByYear(@Param("userIds") List<Long> userIds);

    long countByReferenceyTypeAndStatusIgnoreCase(String referenceyType, String status);

    @Query("""
                select p from Payment p
                where lower(p.status) = 'approved'
                  and p.paymentDate between :start and :end
            """)
    List<Payment> findApprovedBetween(@Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("""
                select p from Payment p
                where lower(p.status) = 'approved'
                  and p.referenceyType = 'EventRegistration'
                  and p.referenceId = :eventId
            """)
    List<Payment> findApprovedEventPayments(@Param("eventId") Long eventId);

    @Query("""
                select p.paymentType, count(p) from Payment p
                group by p.paymentType
            """)
    List<Object[]> countByPaymentTypeGroup();

    List<Payment> findByUserIdInAndStatusAndTaxDeductibleTrueAndPaymentDateBetween(List<Long> familyUserIds,
            String string, LocalDateTime atStartOfDay, LocalDateTime atTime);

}
