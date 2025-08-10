// QuoteRequest.java
package org.agraharam.dto;

import java.util.List;

public record QuoteRequest(
    Long eventId,
    String membershipTier,                // e.g. "Family", "Single"
    List<Long> familyMemberIds,          // size = selected family count
    List<GuestDto> guests,               // guest name/age rows
    List<OfferingQty> offerings          // offeringId + quantity
) {
    public record GuestDto(String name, Integer age) {}
    public record OfferingQty(Long id, Integer quantity) {}
}
