package org.agraharam.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import org.agraharam.enums.PaymentMethod;
import org.agraharam.enums.RefundReferenceType;
import org.agraharam.enums.RefundStatus;

public record RefundDTO(
        Long id,
        Long originalPaymentId,
        RefundReferenceType referenceType,
        Long referenceId,
        Long requesterUserId,
        BigDecimal amountRequested,
        BigDecimal amountApproved,
        RefundStatus status,
        PaymentMethod method,
        String reason,
        String payoutRef,
        Long approvedByUserId,
        Long processedByUserId,
        OffsetDateTime processedAt,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}