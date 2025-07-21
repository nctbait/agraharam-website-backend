package org.agraharam.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.agraharam.audit.Auditable;
import org.agraharam.dto.UserDetailDto;
import org.agraharam.dto.UserSummary;
import org.agraharam.model.Address;
import org.agraharam.model.Family;
import org.agraharam.model.User;
import org.agraharam.repository.AddressRepository;
import org.agraharam.repository.FamilyRepository;
import org.agraharam.repository.UserRepository;
import org.agraharam.service.EmailService;

@RestController
public class ApprovalController {

@Autowired
private UserRepository userRepository;
@Autowired
private AddressRepository addressRepository;
@Autowired
private FamilyRepository familyRepository;

@Autowired
private EmailService emailService;

@GetMapping("/api/pending-users")
@PreAuthorize("hasAuthority('superAdmin')")
public List<UserSummary> getPendingUsers() {
    return userRepository.findPendingGeneralUsers().stream()
        .map(user -> new UserSummary(
            user.getId(),
            user.getFirstName() + " " + user.getLastName(),
            user.getEmail(),
            user.getCreatedAt()
        ))
        .toList();
}

@PostMapping("/api/user/{id}/approve")
@PreAuthorize("hasAuthority('superAdmin')")
@Auditable(action = "APPROVE_MEMBERSHIP", target = "Membership")
public ResponseEntity<String> approveUser(@PathVariable Long id) {
    User user = userRepository.findById(id).orElseThrow();
    Family family = user.getFamily();

    List<User> allFamilyMembers = userRepository.findByFamilyId(family.getId());
    for (User u : allFamilyMembers) {
        u.setApproved(true);
    }
    userRepository.saveAll(allFamilyMembers);
    emailService.sendUserApprovalEmail(user.getFirstName(), user.getLastName(), user.getEmail());
    return ResponseEntity.ok("User approved");
}

@DeleteMapping("/api/user/{id}/reject")
@PreAuthorize("hasAuthority('superAdmin')")
@Auditable(action = "REJECT_MEMBERSHIP", target = "Membership")
public ResponseEntity<String> rejectUser(@PathVariable Long id) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found"));

    if (!user.getRole().equals("primary")) {
        return ResponseEntity.badRequest().body("Only primary user can be rejected directly.");
    }

    Family family = user.getFamily();
    familyRepository.delete(family); // Cascade deletes everything

    return ResponseEntity.ok("User and related family records deleted.");
}

@GetMapping("/api/user/{id}")
@PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
public UserDetailDto getUserDetail(@PathVariable Long id) {
    User user = userRepository.findById(id).orElseThrow();
    Family family = user.getFamily();
    Address address = addressRepository.findByFamilyId(family.getId())
    .orElseThrow(() -> new RuntimeException("Address not found"));
    return new UserDetailDto(user, family, address);
}

    
}



