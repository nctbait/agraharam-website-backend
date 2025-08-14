// src/main/java/.../dto/CheckinSearchRow.java
package org.agraharam.dto;

public record CheckinSearchRow(
    Long registrationId,
    Long eventId,
    String personType,   // PRIMARY_USER | USER | FAMILY_MEMBER | GUEST
    Long sourceId,       // userId / familyMemberId / guestId
    String name,         // display name
    String relation,     // Primary | Spouse | Guest | etc
    boolean checkedIn,
    Long attendeeId
) {}
