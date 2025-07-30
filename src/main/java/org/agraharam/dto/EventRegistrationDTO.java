package org.agraharam.dto;

import java.util.List;

public record EventRegistrationDTO(
    Long eventId,
    List<FamilyMemberRequest> familyMembers,
    List<GuestDTO> guests,
    List<OfferingSelectionDTO> offerings,
    String zelleConfirmation,
    Double totalAmount
) {}



