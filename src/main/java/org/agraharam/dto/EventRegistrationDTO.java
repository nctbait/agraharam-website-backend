package org.agraharam.dto;

import java.util.List;

public record EventRegistrationDTO(
    Long eventId,
    List<Long> familyMemberIds,
    List<GuestDTO> guests,
    String zelleConfirmation
) {}
