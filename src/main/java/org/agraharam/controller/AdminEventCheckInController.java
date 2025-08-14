package org.agraharam.controller;

import java.security.Principal;
import java.util.List;

import org.agraharam.dto.CheckinToggleDTO;
import org.agraharam.service.EventCheckInSearchService;
import org.agraharam.dto.CheckinSearchRowView; // the projection interface from the search repo
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/events")
public class AdminEventCheckInController {

    private final EventCheckInSearchService service;

    public AdminEventCheckInController(EventCheckInSearchService service) {
        this.service = service;
    }

    /**
     * Search registered people (CONFIRMED only) across primary/user/family/guest.
     * q is optional (matches by name). Paginated.
     */
    @GetMapping("/{eventId}/attendees/search")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    public Page<CheckinSearchRowView> search(
            @PathVariable Long eventId,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        size = Math.min(Math.max(size, 10), 200); // clamp 10..200
        return service.search(eventId, q, PageRequest.of(page, size));
    }

    /**
     * Bulk toggle check-in state for the rows currently shown/edited in the UI.
     * Service will INSERT missing rows for checkedIn==true and attendeeId==null,
     * and DELETE existing rows for checkedIn==false and attendeeId!=null.
     */
    @PostMapping("/{eventId}/attendees/toggle")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    public ResponseEntity<?> toggle(
            @PathVariable Long eventId,
            @Validated @RequestBody List<CheckinToggleDTO> updates,
            Principal principal
    ) {
        int changed = service.toggle(eventId, updates, principal.getName());
        return ResponseEntity.ok().body("Updated " + changed + " attendees");
    }

    /**
     * Optional: single-toggle convenience endpoint if you want it.
     */
    @PostMapping("/{eventId}/attendees/toggle-one")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    public ResponseEntity<?> toggleOne(
            @PathVariable Long eventId,
            @Validated @RequestBody CheckinToggleDTO update,
            Principal principal
    ) {
        int changed = service.toggle(eventId, List.of(update), principal.getName());
        return ResponseEntity.ok().body("Updated " + changed + " attendee");
    }
}
