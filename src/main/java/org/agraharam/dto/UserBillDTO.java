package org.agraharam.dto;

import java.time.LocalDate;

import org.agraharam.model.Bill;

public record UserBillDTO(LocalDate date, Double amount, String description, String status) {
    public static UserBillDTO from(Bill b) {
        return new UserBillDTO(
                b.getSubmittedDate(),
                b.getAmount(),
                b.getDescription(),
                b.getStatus()
        );
    }
}

