package org.agraharam.dto;

import java.nio.file.Paths;
import java.time.LocalDate;

import org.agraharam.model.Bill;

public record BillDTO(
    Long id,
    String description,
    Double amount,
    String status,
    String zelleId,
    String zelleName,
    String fileName,
    String memberName,
    LocalDate submittedDate,
    String eventName
) {
    public static BillDTO from(Bill bill, String memberName, String eventName) {
        return new BillDTO(
            bill.getId(),
            bill.getDescription(),
            bill.getAmount(),
            bill.getStatus(),
            bill.getZelleId(),
            bill.getZelleName(),
            extractFileName(bill.getFilePath()),
            memberName,
            bill.getSubmittedDate(),
            eventName
        );
    }

    private static String extractFileName(String path) {
        return path == null ? null : Paths.get(path).getFileName().toString();
    }
}

