package org.agraharam.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RejectRefundRequest(
        @NotBlank @Size(max = 160) String reason
) {}
