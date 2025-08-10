// dto/reports/TransactionRow.java
package org.agraharam.dto.reports;

import org.agraharam.model.Donation;
import org.agraharam.model.Payment;

import java.time.LocalDateTime;

public record TransactionRow(
        String type,          // PAYMENT | DONATION
        Long id,
        LocalDateTime date,
        Double amount,
        String method,        // zelle/paypal/...
        String description,
        String userName,
        String userEmail,
        String referenceType, // event/membership/donation/etc
        Long referenceId,
        String status
) {
    public static TransactionRow fromPayment(Payment p) {
        String userName = (p.getUser() != null)
                ? (p.getUser().getFirstName() + " " + p.getUser().getLastName())
                : null;
        String email = (p.getUser() != null) ? p.getUser().getEmail() : null;
        return new TransactionRow(
                "PAYMENT",
                p.getId(),
                p.getPaymentDate(),
                p.getAmount(),
                p.getPaymentMethod(),
                p.getDescription(),
                userName,
                email,
                p.getReferenceyType(),
                p.getReferenceId(),
                p.getStatus()
        );
    }

    public static TransactionRow fromDonation(Donation d) {
        return new TransactionRow(
                "DONATION",
                d.getId(),
                d.getSubmittedAt(),
                d.getAmount(),
                d.getPaymentMethod(),
                d.getReason(),
                d.getDonorName(),
                d.getEmail(),
                "donation",
                d.getId(),
                d.getStatus()
        );
    }
}
