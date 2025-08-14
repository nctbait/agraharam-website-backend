package org.agraharam.dto;

import java.time.LocalDate;

public record EventDTO(
    Long id,
    String title,
    LocalDate date,
    String venue,
    LocalDate registrationDeadline,
    Integer capacity
    ) {}

