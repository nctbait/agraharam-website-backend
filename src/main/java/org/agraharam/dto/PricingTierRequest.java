package org.agraharam.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PricingTierRequest {
    public String membershipTier;
    public Double basePrice;
    public Integer includedGuests;
    public Double additionalGuestPrice;
    public Integer maxGuests;
}