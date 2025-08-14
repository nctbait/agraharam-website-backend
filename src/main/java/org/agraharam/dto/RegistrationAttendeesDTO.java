package org.agraharam.dto;

import java.util.List;

public record RegistrationAttendeesDTO(
    Long registrationId,
    String primaryName,
    String primaryEmail,
    List<AttendeeDTO> attendees
) {}