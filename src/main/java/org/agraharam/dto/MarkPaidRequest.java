package org.agraharam.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MarkPaidRequest(
        @NotBlank @Size(max = 120) String transactionRef // check #, zelle note, PayPal capture id, etc.
) {}