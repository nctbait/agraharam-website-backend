package org.agraharam.dto;

import org.agraharam.enums.PaymentMethod;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProcessRefundRequest(
        @NotNull PaymentMethod method,
        @NotBlank @Size(max = 160) String payoutRef
) {}
