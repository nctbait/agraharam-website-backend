package org.agraharam.controller;

import org.agraharam.model.ContactMessage;
import org.agraharam.model.ContactMessageNote;
import org.agraharam.repository.ContactMessageNoteRepository;
import org.agraharam.repository.ContactMessageRepository;
import org.agraharam.service.AuditLogService;
import org.agraharam.dto.ContactReplyRequest;
import org.agraharam.dto.ContactStatusUpdateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/admin/contacts")
@PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
public class AdminContactController {

    @Autowired
    private ContactMessageRepository msgRepo;
    @Autowired
    private ContactMessageNoteRepository noteRepo;
    @Autowired
    private JavaMailSender mailer;
    @Autowired
    private AuditLogService audit;

    // LIST with optional filters
    @GetMapping
    public Map<String, Object> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status, // new|in_progress|closed
            @RequestParam(required = false) String committee, // food|events|...
            @RequestParam(required = false) String query // name/email contains
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        // Simple filtering; tune with specs if needed
        Page<ContactMessage> p = msgRepo.findAll(pageable);
        List<ContactMessage> filtered = new ArrayList<>(p.getContent());
        if (status != null && !status.isBlank())
            filtered.removeIf(m -> !status.equalsIgnoreCase(m.getStatus()));
        if (committee != null && !committee.isBlank())
            filtered.removeIf(m -> !committee.equalsIgnoreCase(m.getCommittee()));
        if (query != null && !query.isBlank()) {
            String q = query.toLowerCase();
            filtered.removeIf(m -> !(m.getEmail().toLowerCase().contains(q)
                    || m.getName().toLowerCase().contains(q)));
        }
        return Map.of(
                "content", filtered,
                "page", page,
                "size", size,
                "totalElements", p.getTotalElements(),
                "totalPages", p.getTotalPages());
    }

    @GetMapping("/{id}")
    public Map<String, Object> get(@PathVariable Long id) {
        ContactMessage msg = msgRepo.findById(id).orElseThrow();
        var notes = noteRepo.findByContactMessageIdOrderByCreatedAtAsc(id);
        return Map.of("message", msg, "notes", notes);
    }

    // Send reply (email) + record note + auto-move to in_progress if new
    @PostMapping("/{id}/reply")
    public void reply(@PathVariable Long id,
            @RequestBody ContactReplyRequest req,
            Principal principal) {
        ContactMessage msg = msgRepo.findById(id).orElseThrow();
        String adminEmail = principal.getName();

        // email out
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(msg.getEmail());
        mail.setSubject("Re: Your message to NCTBA (" + msg.getCommittee() + ")");
        mail.setText(req.body());
        mail.setReplyTo(adminEmail);
        mailer.send(mail);

        // note record
        ContactMessageNote note = new ContactMessageNote();
        note.setContactMessage(msg);
        note.setAdminEmail(adminEmail);
        note.setBody(req.body());
        note.setCreatedAt(LocalDateTime.now());
        note.setChannel("email");
        noteRepo.save(note);

        // status bump
        if ("new".equalsIgnoreCase(msg.getStatus())) {
            msg.setStatus("in_progress");
            msgRepo.save(msg);
        }
        audit.log("CONTACT_MESSAGE_UPDATE", adminEmail, "ContactMessage", String.valueOf(msg.getId()),
                "Contact Message Inprogress");

    }

    // Update status (in_progress / closed / new)
    @PutMapping("/{id}/status")
    public void updateStatus(@PathVariable Long id,
            @RequestBody ContactStatusUpdateRequest req, Principal principal) {
        ContactMessage msg = msgRepo.findById(id).orElseThrow();
        String adminEmail = principal.getName();
        String value = Optional.ofNullable(req.status()).orElse("new").toLowerCase();
        if (!List.of("new", "in_progress", "closed").contains(value))
            throw new IllegalArgumentException("Invalid status");
        msg.setStatus(value);
        msgRepo.save(msg);
        audit.log("CONTACT_MESSAGE_UPDATE", adminEmail, "ContactMessage", String.valueOf(msg.getId()),
                "Contact Message Status update:" + value);
    }
}
