package org.agraharam.dto;

import jakarta.validation.constraints.*;
import org.agraharam.enums.PaymentMethod;

import java.math.BigDecimal;

public record CreateVendorPaymentRequest(
        @NotNull Long vendorId,
        Long eventId,                      // optional: tie to Event
        @Size(max = 80) String invoiceNumber,
        @Size(max = 600) String description,
        @NotNull @DecimalMin("0.01") BigDecimal amount,
        @NotNull PaymentMethod paymentMethod
) {}





