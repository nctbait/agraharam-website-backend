package org.agraharam.dto;

import java.time.LocalDateTime;

import org.agraharam.model.Donation;
import org.agraharam.model.Payment;
import org.agraharam.model.Refund;

public record UserPaymentDTO(LocalDateTime date, Double amount, String description, String status) {
    public static UserPaymentDTO from(Payment p) {
        return new UserPaymentDTO(
                p.getPaymentDate(),
                p.getAmount(),
                p.getDescription(),
                p.getStatus()
        );
    }
    public static UserPaymentDTO from(Donation d) {
        return new UserPaymentDTO(
            d.getSubmittedAt(), 
            d.getAmount(), 
            d.getReason(), 
            d.getStatus())
        ;
    }
    public static UserPaymentDTO from(Refund r) {
        return new UserPaymentDTO(
            r.getCreatedAt().toLocalDateTime(), 
            - r.getAmountRequested().doubleValue(), 
            r.getReason(), 
            r.getStatus().name())
        ;
    }

}


