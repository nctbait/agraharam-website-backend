package org.agraharam.dto;

import jakarta.validation.constraints.NotNull;

/**
 * Payload sent from the UI when an admin checks/unchecks an attendee.
 * If checkedIn == true and attendeeId == null -> backend INSERTs.
 * If checkedIn == false and attendeeId != null -> backend DELETEs.
 */
public record CheckinToggleDTO(
    @NotNull Long registrationId,
    @NotNull String personType,   // PRIMARY_USER | USER | FAMILY_MEMBER | GUEST
    @NotNull Long sourceId,       // userId / familyMemberId / guestId
    @NotNull String name,         // display name used in audit (not for matching)
    String relation,              // Primary | Spouse | Guest | etc
    @NotNull Boolean checkedIn,
    Long attendeeId               // null for new check-ins
) {}
