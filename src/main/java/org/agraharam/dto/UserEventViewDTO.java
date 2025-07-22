package org.agraharam.dto;

import java.time.LocalDate;
import java.util.List;

public record UserEventViewDTO(
    Long registrationId,
    Long eventId,
    String eventName,
    LocalDate date,
    List<String> registeredNames,
    List<String> guestNames,
    String status
    ) {}
