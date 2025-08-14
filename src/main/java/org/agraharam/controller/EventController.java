package org.agraharam.controller;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.agraharam.audit.Auditable;
import org.agraharam.dto.EventRequest;
import org.agraharam.dto.EventSummary;
import org.agraharam.model.Event;
import org.agraharam.model.EventOffering;
import org.agraharam.model.PricingTier;
import org.agraharam.repository.EventRepository;
import org.agraharam.service.AuditLogServiceImpl;
import org.agraharam.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
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
    @Autowired
    private AuditLogServiceImpl auditLog;

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    @Auditable(action = "CREATE_EVENT", target = "Event")
    public ResponseEntity<?> createEvent(@RequestBody EventRequest eventRequest,Principal principal) {
        eventService.saveEvent(eventRequest,principal.getName());
        return ResponseEntity.ok("Event created");
    }

    @GetMapping("/list")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    public List<EventSummary> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(EventSummary::from) // map to DTO
                .toList();
    }

    @GetMapping("/upcoming")
    @PreAuthorize("hasAuthority('user') or hasAuthority('admin') or hasAuthority('superAdmin')")
    public List<EventSummary> getUpcomingEvents() {
        return eventRepository.findByDateAfter(LocalDate.now()).stream()
                .map(EventSummary::from) // map to DTO
                .toList();
    }

    @GetMapping("/list/{date}")
    //@PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    public List<EventSummary> getAllEventsAfterDate(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return eventRepository.findByDateAfter(date).stream()
                .map(EventSummary::from) // map to DTO
                .toList();
    }

    @DeleteMapping("/delete/{eventId}")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    @Auditable(action = "DELETE_EVENT", target = "Event")
    public ResponseEntity<?> deleteEvent(@PathVariable Long eventId,Principal principal) {
        if (!eventRepository.existsById(eventId)) {
            return ResponseEntity.notFound().build();
        }
        eventRepository.deleteById(eventId);
        auditLog.log("DELETE_EVENT", principal.getName(), "Event", String.valueOf(eventId),"Delete event with id:"+ eventId);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/get/{eventId}")
    @PreAuthorize("hasAuthority('user') or hasAuthority('admin') or hasAuthority('superAdmin')")
    public ResponseEntity<EventSummary> getEventById(@PathVariable Long eventId) {
        return eventRepository.findById(eventId)
                .map(event -> ResponseEntity.ok(EventSummary.from(event)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{eventId}")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    @Auditable(action = "EDIT_EVENT", target = "Event")
    public ResponseEntity<?> updateEvent(@PathVariable Long eventId, @RequestBody EventRequest req,Principal principal) {
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
        
        event.getOfferings().clear();// Remove existing offerings

        List<EventOffering> offeringList = req.offerings.stream()
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

        event.getOfferings().addAll(offeringList);

        eventRepository.save(event);

        auditLog.log("UPDATE_EVENT", principal.getName(), "Event", String.valueOf(event.getId()),"Saving event with id:"+ event.getId());
        return ResponseEntity.ok("Event updated");
    }

}
