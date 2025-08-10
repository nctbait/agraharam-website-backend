// QuoteResponse.java
package org.agraharam.dto;

public record QuoteResponse(
    double basePrice,
    int includedGuests,
    int maxGuests,
    int additionalGuestCount,
    double additionalGuestPrice,
    double additionalGuestFee,
    double offeringsTotal,
    double total,
    String message
) {}
