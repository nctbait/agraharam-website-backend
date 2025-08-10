package org.agraharam.dto;

import jakarta.validation.constraints.Size;

public record ApproveVendorPaymentRequest(
        @Size(max = 160) String note // optional approval note, stored in transactionRef or make a separate field
) {}
