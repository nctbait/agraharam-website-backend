package org.agraharam.dto;

import lombok.Data;
import org.agraharam.model.Event;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class EventSummary {
    private Long id;
    private String title;
    private String description;
    private LocalDate date;
    private LocalTime time;
    private String location;
    private String locationUrl;
    private Integer capacity;
    private Boolean waitlist;
    private LocalDate registrationDeadline;
    private List<PricingTierSummary> pricing;
    private List<EventOfferingSummary> offerings;

    public static EventSummary from(Event event) {
        EventSummary dto = new EventSummary();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setDate(event.getDate());
        dto.setTime(event.getTime());
        dto.setLocation(event.getLocation());
        dto.setLocationUrl(event.getLocationUrl());
        dto.setCapacity(event.getCapacity());
        dto.setWaitlist(event.getWaitlist());
        dto.setRegistrationDeadline(event.getRegistrationDeadline());
        dto.setPricing(event.getPricing().stream()
            .map(PricingTierSummary::from)
            .collect(Collectors.toList()));
        dto.setOfferings(event.getOfferings().stream().map(EventOfferingSummary::from).collect(Collectors.toList()));
        return dto;
    }
}
