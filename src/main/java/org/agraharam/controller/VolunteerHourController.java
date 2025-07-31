package org.agraharam.controller;

import java.security.Principal;
import java.util.List;

import org.agraharam.dto.PendingVolunteerHourDTO;
import org.agraharam.dto.VolunteerHourRequest;
import org.agraharam.dto.VolunteerHourSummaryDTO;
import org.agraharam.dto.VolunteerHourYearlyDTO;
import org.agraharam.service.VolunteerHourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class VolunteerHourController {
    @Autowired
    private VolunteerHourService service;

    @GetMapping("/volunteer-hours/family-summary")
    // @PreAuthorize("hasAuthority('user') or hasAuthority('admin') or
    // hasAuthority('superAdmin')")
    public List<VolunteerHourSummaryDTO> getFamilySummary(Principal principal) {
        System.out.println("Current user: " + principal.getName());

        return service.getFamilyHourSummary(principal.getName());
    }

    @PostMapping("/volunteer-hours")
    public ResponseEntity<Void> submit(@RequestBody VolunteerHourRequest req, Principal principal) {
        service.saveVolunteerHour(principal.getName(), req);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/admin/volunteer-hours/pending")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    public List<PendingVolunteerHourDTO> getPendingVolunteerHours() {
        return service.getPendingVolunteerHours();
    }

    @PostMapping("/admin/volunteer-hours/{id}/{action}")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @PathVariable String action) {
        service.updateVolunteerHourStatus(id, action);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/admin/volunteer-hours/bulk/{action}")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    public ResponseEntity<?> bulkUpdateStatus(@PathVariable String action, @RequestBody List<Long> ids) {
        service.bulkUpdateVolunteerHourStatus(ids, action);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/volunteer-hours/family-yearly-summary")
    public List<VolunteerHourYearlyDTO> getYearlySummary(Principal principal) {
        return service.getYearlySummary(principal.getName());
    }


}
