package org.agraharam.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.agraharam.audit.Auditable;
import org.agraharam.dto.EventRequest;
import org.agraharam.dto.EventSummary;
import org.agraharam.model.Event;
import org.agraharam.model.PricingTier;
import org.agraharam.repository.EventRepository;
import org.agraharam.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    @Autowired
    private final EventService eventService;
    @Autowired
    private EventRepository eventRepository;

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    @Auditable(action = "CREATE_EVENT", target = "Event")
    public ResponseEntity<?> createEvent(@RequestBody EventRequest eventRequest) {
        eventService.saveEvent(eventRequest);
        return ResponseEntity.ok("Event created");
    }

    @GetMapping("/list")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    public List<EventSummary> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(EventSummary::from) // map to DTO
                .toList();
    }

    @DeleteMapping("/delete/{eventId}")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    @Auditable(action = "DELETE_EVENT", target = "Event")
    public ResponseEntity<?> deleteEvent(@PathVariable Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            return ResponseEntity.notFound().build();
        }
        eventRepository.deleteById(eventId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/get/{eventId}")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    public ResponseEntity<EventSummary> getEventById(@PathVariable Long eventId) {
        return eventRepository.findById(eventId)
                .map(event -> ResponseEntity.ok(EventSummary.from(event)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{eventId}")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    @Auditable(action = "EDIT_EVENT", target = "Event")
    public ResponseEntity<?> updateEvent(@PathVariable Long eventId, @RequestBody EventRequest req) {
        Optional<Event> existing = eventRepository.findById(eventId);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Event event = existing.get();
        event.setTitle(req.title);
        event.setDescription(req.description);
        event.setDate(LocalDate.parse(req.date));
        event.setTime(LocalTime.parse(req.time));
        event.setLocation(req.location);
        event.setLocationUrl(req.locationUrl);
        event.setCapacity(req.capacity);
        event.setWaitlist(req.waitlist != null && req.waitlist);
        event.setRegistrationDeadline(LocalDate.parse(req.registrationDeadline));

        // Remove existing pricing
        event.getPricing().clear();

        // Add updated pricing
        List<PricingTier> updatedPricing = req.pricing.stream().map(p -> {
            PricingTier pt = new PricingTier();
            pt.setEvent(event);
            pt.setMembershipTier(p.membershipTier);
            pt.setBasePrice(p.basePrice);
            pt.setIncludedGuests(p.includedGuests);
            pt.setAdditionalGuestPrice(p.additionalGuestPrice);
            pt.setMaxGuests(p.maxGuests);
            return pt;
        }).collect(Collectors.toList());

        event.getPricing().addAll(updatedPricing);

        eventRepository.save(event);
        return ResponseEntity.ok("Event updated");
    }

}
