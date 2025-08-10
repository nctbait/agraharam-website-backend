package org.agraharam.dto;

import java.time.OffsetDateTime;

public record VendorDTO(
        Long id,
        String name,
        String contactName,
        String phone,
        String email,
        String address,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}