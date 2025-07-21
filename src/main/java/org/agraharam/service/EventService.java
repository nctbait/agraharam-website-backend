package org.agraharam.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.agraharam.dto.EventRequest;
import org.agraharam.model.Event;
import org.agraharam.model.EventOffering;
import org.agraharam.model.PricingTier;
import org.agraharam.repository.EventRepository;
import org.springframework.stereotype.Service;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Service
@RequiredArgsConstructor
@Getter
@Setter
public class EventService {

    private final EventRepository eventRepository;

    public void saveEvent(EventRequest request) {
        Event event = new Event();
        event.setTitle(request.title);
        event.setDescription(request.description);
        event.setDate(LocalDate.parse(request.date));
        event.setTime(LocalTime.parse(request.time));
        event.setLocation(request.location);
        event.setLocationUrl(request.locationUrl);
        event.setCapacity(request.capacity);
        event.setWaitlist(request.waitlist != null ? request.waitlist : false);
        event.setRegistrationDeadline(LocalDate.parse(request.registrationDeadline));

        List<PricingTier> pricingList = request.pricing.stream()
            .map(p -> {
                PricingTier pt = new PricingTier();
                pt.setMembershipTier(p.membershipTier);
                pt.setBasePrice(p.basePrice);
                pt.setIncludedGuests(p.includedGuests);
                pt.setAdditionalGuestPrice(p.additionalGuestPrice);
                pt.setMaxGuests(p.maxGuests);
                pt.setEvent(event); // set parent
                return pt;
            })
            .collect(Collectors.toList());

        event.setPricing(pricingList);

        List<EventOffering> offeringList = request.offerings.stream()
        .map(o -> {
            EventOffering offering = new EventOffering();
            offering.setName(o.name);
            offering.setDescription(o.description);
            offering.setPrice(o.price);
            offering.setMaxQuantity(o.maxQuantity);
            offering.setEvent(event); // reverse mapping
            return offering;
        })
        .collect(Collectors.toList());

        event.setOfferings(offeringList);
        eventRepository.save(event);

        

    }
}