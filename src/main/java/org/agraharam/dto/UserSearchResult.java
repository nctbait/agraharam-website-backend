package org.agraharam.dto;

public record UserSearchResult(
        Long id,
        Long familyId,
        String firstName,
        String lastName,
        String email
    ) {}
