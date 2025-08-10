// EventQuoteService.java
package org.agraharam.service;

import lombok.RequiredArgsConstructor;
import org.agraharam.dto.QuoteRequest;
import org.agraharam.dto.QuoteResponse;
import org.agraharam.model.Event;
import org.agraharam.model.EventOffering;
import org.agraharam.model.PricingTier;
import org.agraharam.repository.EventOfferingRepository;
import org.agraharam.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EventQuoteService {

    private final EventRepository eventRepo;
    private final EventOfferingRepository offeringRepo;

    @Transactional(readOnly = true)
    public QuoteResponse calculate(QuoteRequest req) {
        Event ev = eventRepo.findById(req.eventId())
            .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        PricingTier tier = ev.getPricing().stream()
            .filter(p -> p.getMembershipTier().equalsIgnoreCase(req.membershipTier()))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Pricing not configured for membership tier"));

        int familyCount = req.familyMemberIds() == null ? 0 : req.familyMemberIds().size();
        int guestCount = req.guests() == null ? 0 : (int) req.guests().stream()
            .filter(g -> g.name() != null && !g.name().isBlank() && g.age() != null).count();

        int maxGuests = tier.getMaxGuests() == null ? Integer.MAX_VALUE : tier.getMaxGuests();
        int totalPeople = familyCount + guestCount;

        // hard cap at maxGuests (server-side authority)
        if (totalPeople > maxGuests) {
            guestCount = Math.max(0, maxGuests - familyCount);
            totalPeople = familyCount + guestCount;
        }

        int included = tier.getIncludedGuests() == null ? 0 : tier.getIncludedGuests();
        double basePrice = tier.getBasePrice() == null ? 0d : tier.getBasePrice();
        double addlPrice = tier.getAdditionalGuestPrice() == null ? 0d : tier.getAdditionalGuestPrice();

        int additionalGuestCount = Math.max(0, totalPeople - included);
        double additionalGuestFee = additionalGuestCount * addlPrice;

        // offerings total (respect maxQuantity)
        double offeringsTotal = 0d;
        if (req.offerings() != null) {
            for (var oq : req.offerings()) {
                EventOffering off = offeringRepo.findById(oq.id())
                    .orElseThrow(() -> new IllegalArgumentException("Offering not found: " + oq.id()));
                int q = oq.quantity() == null ? 0 : oq.quantity();
                int maxQ = off.getMaxQuantity() == null ? Integer.MAX_VALUE : off.getMaxQuantity();
                if (q > maxQ) q = maxQ;
                offeringsTotal += q * (off.getPrice() == null ? 0d : off.getPrice());
            }
        }

        double total = basePrice + additionalGuestFee + offeringsTotal;

        String msg = totalPeople > maxGuests
            ? "Guest count adjusted to the maximum allowed for your tier."
            : null;

        return new QuoteResponse(
            round2(basePrice),
            included,
            maxGuests == Integer.MAX_VALUE ? Integer.MAX_VALUE : maxGuests,
            additionalGuestCount,
            round2(addlPrice),
            round2(additionalGuestFee),
            round2(offeringsTotal),
            round2(total),
            msg
        );
    }

    private double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}
