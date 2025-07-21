package org.agraharam.controller;

import java.util.List;

import org.agraharam.audit.Auditable;
import org.agraharam.dto.CurrentMembershipResponse;
import org.agraharam.dto.MembershipUpgradeRequest;
import org.agraharam.model.MembershipType;
import org.agraharam.model.User;
import org.agraharam.repository.UserRepository;
import org.agraharam.service.MembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/memberships")
public class MembershipController {

    private final MembershipService membershipService;
    @Autowired
    private UserRepository userRepository;

    public MembershipController(MembershipService membershipService) {
        this.membershipService = membershipService;
    }

    @GetMapping("/available")
    public List<MembershipType> getAvailableMemberships() {
        return membershipService.getAvailableMemberships();
    }

    @PostMapping("/upgrade")
    @Auditable(action = "UPGRADE_MEMBERSHIP", target = "Membership")
    public ResponseEntity<?> upgradeMembership(@RequestBody MembershipUpgradeRequest request,
            Authentication authentication) {
        String email = authentication.getName(); // email from JWT
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        membershipService.createPendingMembership(user.getId(), request);
        return ResponseEntity.ok("Membership upgrade request submitted.");
    }

    @GetMapping("/current")
    public ResponseEntity<CurrentMembershipResponse> getCurrentMembership() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Assuming you stored userId as a claim or in principal
        Long userId = extractUserId(authentication);

        return ResponseEntity.ok(membershipService.getCurrentMembership(userId));
    }

    private Long extractUserId(Authentication authentication) {
        if (authentication
                .getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails userDetails) {
            // use username/email and query DB
            return userRepository.findByEmail(userDetails.getUsername())
                    .map(User::getId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        // Or if you stored userId directly in principal as Long/String
        if (authentication.getPrincipal() instanceof String raw) {
            return userRepository.findByEmail(raw)
                    .map(User::getId)
                    .orElseThrow(() -> new RuntimeException("User not found")); // Only if your principal is a
                                                                                // stringified userId
        }

        throw new RuntimeException("Unsupported principal type");
    }

}
