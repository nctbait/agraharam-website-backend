// dto/reports/ExpenseRow.java
package org.agraharam.dto.reports;

import org.agraharam.model.Bill;

import java.time.LocalDate;

public record ExpenseRow(
        Long id,
        LocalDate date,
        Double amount,
        String description,
        Long submittedBy,
        String zelleId
) {
    public static ExpenseRow fromBill(Bill b) {
        return new ExpenseRow(
                b.getId(),
                b.getSubmittedDate(),
                b.getAmount(),
                b.getDescription(),
                b.getMemberId(),
                b.getZelleId()
        );
    }
}
