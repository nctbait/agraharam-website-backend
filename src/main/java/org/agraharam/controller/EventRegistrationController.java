package org.agraharam.controller;

import java.security.Principal;
import java.util.List;

import org.agraharam.dto.EventDTO;
import org.agraharam.dto.EventRegistrationDTO;
import org.agraharam.dto.UserEventViewDTO;
import org.agraharam.service.AuditLogService;
import org.agraharam.service.EventRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/event-registrations")
public class EventRegistrationController {

    @Autowired
    private EventRegistrationService registrationService;
    @Autowired
    private AuditLogService auditLogService;

    @GetMapping("/my")
    public List<UserEventViewDTO> myRegistrations(Principal principal) {
        return registrationService.getMyRegistrations(principal.getName());
    }

    @PostMapping
    public ResponseEntity<?> register(@RequestBody EventRegistrationDTO dto, Principal principal) {
        registrationService.register(dto, principal.getName());
        auditLogService.log("REGISTER_EVENT", principal.getName(), "EventRegistration", dto.eventId().toString(),
                "User registered for event");
        return ResponseEntity.ok("Registered");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody EventRegistrationDTO dto, Principal principal) {
        registrationService.updateRegistration(id, dto, principal.getName());
        auditLogService.log("UPDATE_EVENT", principal.getName(), "EventRegistration", String.valueOf(id),
                "User updated registration");
        return ResponseEntity.ok("Updated");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancel(@PathVariable Long id, Principal principal) {
        registrationService.cancelRegistration(id, principal.getName());
        auditLogService.log("CANCEL_EVENT", principal.getName(), "EventRegistration", String.valueOf(id),
                "User cancelled registration");
        return ResponseEntity.ok("Cancelled");
    }

    @GetMapping("/available")
    public List<EventDTO> getAvailableEvents(Principal principal) {
        return registrationService.getAvailableEventsForFamily(principal.getName());
    }

    @GetMapping("/history")
    public List<EventDTO> getPastEvents(Principal principal) {
        return registrationService.getPastEventsForFamily(principal.getName());
    }

    @GetMapping("/{id}")
    public EventRegistrationDTO getRegistration(@PathVariable Long id, Principal principal) {
        return registrationService.getRegistration(id, principal.getName());
    }

}
