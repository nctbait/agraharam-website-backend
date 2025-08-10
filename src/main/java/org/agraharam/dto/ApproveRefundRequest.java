package org.agraharam.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ApproveRefundRequest(
        @NotNull @DecimalMin("0.01") BigDecimal amountApproved,
        @Size(max = 800) String note            // will be copied into reason (append) or kept separate if you add a notes table
) {}