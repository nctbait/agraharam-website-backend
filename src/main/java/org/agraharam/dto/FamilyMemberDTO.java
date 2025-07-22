package org.agraharam.dto;

public record FamilyMemberDTO(
    Long id,
    String name,
    int age,
    String relation,
    String school,
    String skills,
    String preferences
) {}
