package org.agraharam.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

import org.agraharam.enums.RefundReferenceType;

public record CreateRefundRequest(
        @NotNull RefundReferenceType referenceType,
        @NotNull Long referenceId,
        Long originalPaymentId,                 // optional
        Long requesterUserId,                   // optional; if created from UI on behalf of member
        @NotNull @DecimalMin("0.01") BigDecimal amountRequested,
        @Size(max = 800) String reason          // optional
) {}
