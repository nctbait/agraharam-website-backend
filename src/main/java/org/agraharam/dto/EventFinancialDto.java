package org.agraharam.dto;

import java.math.BigDecimal;
import java.util.List;

public record EventFinancialDto(
    List<TransactionRow> rows,
    BigDecimal income,          // Payments + Donations linked to event
    BigDecimal refunds,         // Refunds linked to event
    BigDecimal vendorExpenses,  // Vendor payments linked to event
    BigDecimal bills,           // Bills linked to event
    BigDecimal net              // income - refunds - vendorExpenses - bills
) {
    public static EventFinancialDto of(List<TransactionRow> rows,
        BigDecimal income,
                                       BigDecimal refunds,
                                       BigDecimal vendorExpenses,
                                       BigDecimal bills) {
        if (income == null) income = BigDecimal.ZERO;
        if (refunds == null) refunds = BigDecimal.ZERO;
        if (vendorExpenses == null) vendorExpenses = BigDecimal.ZERO;
        if (bills == null) bills = BigDecimal.ZERO;

        BigDecimal net = income
                .subtract(refunds)
                .subtract(vendorExpenses)
                .subtract(bills);

        return new EventFinancialDto(rows,income, refunds, vendorExpenses, bills, net);
    }
}
