// dto/reports/EventFinancialReport.java
package org.agraharam.dto.reports;

import org.agraharam.model.Bill;
import org.agraharam.model.Event;
import org.agraharam.model.Payment;

import java.util.List;
import java.util.Objects;

public record EventFinancialReport(
        Long eventId,
        String title,
        String date,
        double totalIncome,
        double totalExpenses,
        double net,
        List<TransactionRow> incomeRows,
        List<ExpenseRow> expenseRows
) {
    public static EventFinancialReport from(Event e, List<Payment> income, List<Bill> expenses) {
        List<TransactionRow> incRows = income.stream().map(TransactionRow::fromPayment).toList();
        List<ExpenseRow> expRows = expenses.stream().map(ExpenseRow::fromBill).toList();
        double incSum = income.stream().map(Payment::getAmount).filter(Objects::nonNull).mapToDouble(Double::doubleValue).sum();
        double expSum = expenses.stream().map(Bill::getAmount).filter(Objects::nonNull).mapToDouble(Double::doubleValue).sum();
        return new EventFinancialReport(
                e.getId(),
                e.getTitle(),
                e.getDate() != null ? e.getDate().toString() : null,
                incSum,
                expSum,
                incSum - expSum,
                incRows,
                expRows
        );
    }
}
