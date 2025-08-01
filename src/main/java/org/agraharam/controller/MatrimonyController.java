package org.agraharam.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.agraharam.model.MatrimonyProfile;
import org.agraharam.model.User;
import org.agraharam.repository.MatrimonyProfileRepository;
import org.agraharam.repository.UserRepository;
import org.agraharam.service.AuditLogServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/matrimony")
public class MatrimonyController {

    @Autowired
    private MatrimonyProfileRepository repository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private  AuditLogServiceImpl auditLogService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody MatrimonyProfile profile) {
        profile.setStatus("pending");
        MatrimonyProfile saved = repository.save(profile);

        auditLogService.log("MATRIMONY_REGISTRATION", saved.getContactEmail(), 
        "MatrimonyProfile", String.valueOf(saved.getId()), 
        "MATRIMONY_REGISTRATION Submitted by :"+ saved.getContactEmail());
        return ResponseEntity.ok(saved.getId());
    }

    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path path = Paths.get("uploads/matrimony/" + fileName);
        Files.createDirectories(path.getParent());
        Files.write(path, file.getBytes());
        String publicUrl = "/uploads/matrimony/" + fileName;
        return ResponseEntity.ok(publicUrl);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    public List<MatrimonyProfile> getPendingProfiles() {
        return repository.findByStatus("pending");
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    public ResponseEntity<?> approve(@PathVariable Long id, @RequestBody(required = false) Map<String, Object> body,Principal principal) {
        Long familyId = null;
        if (body != null && body.containsKey("familyId")) {
            Object raw = body.get("familyId");
            if (raw instanceof Number) {
                familyId = ((Number) raw).longValue();
            } else if (raw instanceof String) {
                familyId = Long.parseLong((String) raw);
            }
        }

        MatrimonyProfile p = repository.findById(id).orElseThrow();
        p.setStatus("approved");
        if (familyId != null)
            p.setFamilyId(familyId);
        repository.save(p);

        auditLogService.log("APPROVE_MATRIMONY", principal.getName(), 
        "MatrimonyProfile", String.valueOf(p.getId()), 
        "APPROVE_MATRIMONY by :"+ principal.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    public ResponseEntity<?> reject(@PathVariable Long id,Principal principal) {
        MatrimonyProfile p = repository.findById(id).orElseThrow();
        p.setStatus("rejected");
        repository.save(p);

        auditLogService.log("REJECT_MATRIMONY", principal.getName(), 
        "MatrimonyProfile", String.valueOf(p.getId()), 
        "REJECT_MATRIMONY by :"+ principal.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    public MatrimonyProfile viewDetails(@PathVariable Long id) {
        return repository.findById(id).orElseThrow();
    }

    @GetMapping("/is-eligible")
    @PreAuthorize("isAuthenticated()")
    public boolean isEligibleForMatrimonySearch(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return repository.existsByFamilyIdAndStatus(user.getFamily().getId(), "approved");
    }

    @GetMapping("/all-profiles")
    @PreAuthorize("hasAuthority('user') or hasAuthority('admin') or hasAuthority('superAdmin')")
    public List<MatrimonyProfile> getAllProfilesForSearch() {
        return repository.findByStatus("approved");
    }

}
