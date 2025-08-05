package org.agraharam.controller;

import java.security.Principal;
import java.util.List;

import org.agraharam.model.NotificationTemplate;
import org.agraharam.repository.NotificationTemplateRepository;
import org.agraharam.service.AuditLogServiceImpl;
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
@RequestMapping("/api/admin/notification-templates")
public class NotificationTemplateController {

    @Autowired
    private NotificationTemplateRepository templateRepository;
    @Autowired
    private AuditLogServiceImpl audit;

    @GetMapping
    public List<NotificationTemplate> getAll() {
        return templateRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificationTemplate> getOne(@PathVariable Long id) {
        return templateRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public NotificationTemplate create(@RequestBody NotificationTemplate template, Principal p) {
        NotificationTemplate saved = templateRepository.save(template);
        audit.log("NOTIFICATION_TEMPLATE_CREATED", p.getName(), "NotificationTemplate",
                String.valueOf(saved.getId()), "Notification Template Created with title:" + saved.getTitle());
        return saved;
    }

    @PutMapping("/{id}")
    public ResponseEntity<NotificationTemplate> update(@PathVariable Long id,
            @RequestBody NotificationTemplate updated, Principal p) {
        NotificationTemplate existing = templateRepository.findById(id).orElse(null);
        existing.setTitle(updated.getTitle());
        existing.setType(updated.getType());
        existing.setChannel(updated.getChannel());
        existing.setSubject(updated.getSubject());
        existing.setBody(updated.getBody());
        existing.setActive(updated.isActive());
        existing.setVariables(updated.getVariables());
        templateRepository.save(existing);
        audit.log("NOTIFICATION_TEMPLATE_UPDATE", p.getName(), "NotificationTemplate",
                String.valueOf(existing.getId()), "Notification Template Updated with title:" + existing.getTitle());
        return ResponseEntity.ok(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, Principal p) {
        NotificationTemplate existing = templateRepository.findById(id).orElse(null);
        audit.log("NOTIFICATION_TEMPLATE_DELETE", p.getName(), "NotificationTemplate",
                String.valueOf(id), "Notification Template Updated with title:" + existing.getTitle());
        templateRepository.deleteById(id);
    }
}