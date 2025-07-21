package org.agraharam.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.agraharam.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUserIdAndTaxDeductibleTrueAndPaymentDateBetween(
        Long userId, LocalDateTime start, LocalDateTime end);
}
