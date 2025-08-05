package org.agraharam.controller;

import java.security.Principal;
import java.util.List;

import org.agraharam.dto.VolunteerInterestAdminView;
import org.agraharam.dto.VolunteerInterestRequest;
import org.agraharam.service.VolunteerInterestServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class VolunteerController {

    @Autowired
    VolunteerInterestServiceImpl volunteerInterestService;

    @PostMapping("/volunteer-interest")
    public ResponseEntity<?> submitVolunteerInterest(@RequestBody List<VolunteerInterestRequest> requests,Principal principal) {
        volunteerInterestService.submitVolunteerInterest(requests,principal.getName());
        return ResponseEntity.ok("Saved successfully");
    }
    @GetMapping("/volunteer-interest/family")
    public ResponseEntity<List<VolunteerInterestRequest>> getFamilyVolunteerInterests(Principal principal) {
        return ResponseEntity.ok(volunteerInterestService.getVolunteerInterest(principal.getName()));
    }

    @GetMapping("/volunteer-interest/all")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    public ResponseEntity<List<VolunteerInterestAdminView>> getallVolunteerInterests(Principal principal) {
        return ResponseEntity.ok(volunteerInterestService.getAllVolunteerInterests());
    }

}
