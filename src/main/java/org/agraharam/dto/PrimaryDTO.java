package org.agraharam.dto;

public record PrimaryDTO(
    Long id,
    String firstName,
    String lastName,
    String email,
    String phoneNumber
) {}
