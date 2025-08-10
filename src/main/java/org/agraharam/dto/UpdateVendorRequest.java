package org.agraharam.dto;

import jakarta.validation.constraints.*;

public record UpdateVendorRequest(
        @NotBlank @Size(max = 160) String name,
        @Size(max = 120) String contactName,
        @Size(max = 40) String phone,
        @Email @Size(max = 160) String email,
        @Size(max = 500) String address
) {}