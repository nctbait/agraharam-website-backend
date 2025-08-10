package org.agraharam.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import org.agraharam.enums.PaymentMethod;
import org.agraharam.enums.VendorPaymentStatus;

public record VendorPaymentDTO(
        Long id,
        Long vendorId,
        String vendorName,
        Long eventId,
        String eventTitle,
        String invoiceNumber,
        String description,
        BigDecimal amount,
        PaymentMethod paymentMethod,
        VendorPaymentStatus status,
        Long createdByUserId,
        Long approvedByUserId,
        Long paidByUserId,
        OffsetDateTime approvedAt,
        OffsetDateTime paidAt,
        String transactionRef,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}