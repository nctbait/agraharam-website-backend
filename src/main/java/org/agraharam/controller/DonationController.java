package org.agraharam.controller;

import java.security.Principal;
import java.util.List;

import org.agraharam.dto.DonationRequest;
import org.agraharam.dto.IdList;
import org.agraharam.model.Donation;
import org.agraharam.service.DonationService;
import org.agraharam.service.RecaptchaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class DonationController {

    @Autowired
    private DonationService donationService;
    @Autowired
    RecaptchaService recaptchaService;

    @PostMapping("/api/donations")
    public ResponseEntity<Void> submitDonation(@RequestBody DonationRequest request, Principal principal) {

        if (principal == null && !recaptchaService.verify(request.getCaptchaToken())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid reCAPTCHA");
        }

        donationService.saveDonation(request, principal);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/api/donations/pending")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    public ResponseEntity<List<Donation>> getPending() {
        return ResponseEntity.ok(donationService.getPendingDonations());
    }

    @PostMapping("/api/donations/approve")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    public void approveDonations(@RequestBody IdList request, Principal principal) {
        donationService.bulkApprove(request.getIds(),  principal);
    }

    @PostMapping("/api/donations/reject")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    public void rejectDonations(@RequestBody IdList request, Principal principal) {
        donationService.bulkReject(request.getIds(),  principal);
    }
}
