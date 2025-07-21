package org.agraharam.dto;

import lombok.Data;
import org.agraharam.model.PricingTier;

@Data
public class PricingTierSummary {
    private String membershipTier;
    private Double basePrice;
    private Integer includedGuests;
    private Double additionalGuestPrice;
    private Integer maxGuests;

    public static PricingTierSummary from(PricingTier pt) {
        PricingTierSummary dto = new PricingTierSummary();
        dto.setMembershipTier(pt.getMembershipTier());
        dto.setBasePrice(pt.getBasePrice());
        dto.setIncludedGuests(pt.getIncludedGuests());
        dto.setAdditionalGuestPrice(pt.getAdditionalGuestPrice());
        dto.setMaxGuests(pt.getMaxGuests());
        return dto;
    }
}
