package org.agraharam.controller;

import java.util.List;

import org.agraharam.model.NotificationSchedule;
import org.agraharam.model.NotificationTemplate;
import org.agraharam.repository.NotificationScheduleRepository;
import org.agraharam.repository.NotificationTemplateRepository;
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
@RequestMapping("/api/admin/notification-schedules")
public class NotificationScheduleController {

    @Autowired
    private NotificationScheduleRepository scheduleRepository;

    @Autowired
    private NotificationTemplateRepository templateRepository;

    @GetMapping
    public List<NotificationSchedule> getAll() {
        return scheduleRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificationSchedule> getOne(@PathVariable Long id) {
        return scheduleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<NotificationSchedule> create(@RequestBody NotificationSchedule schedule) {
        if (schedule.getTemplate() != null && schedule.getTemplate().getId() != null) {
            NotificationTemplate template = templateRepository.findById(schedule.getTemplate().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid template ID"));
            schedule.setTemplate(template);
        }
        return ResponseEntity.ok(scheduleRepository.save(schedule));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NotificationSchedule> update(@PathVariable Long id, @RequestBody NotificationSchedule updated) {
        return scheduleRepository.findById(id).map(existing -> {
            if (updated.getTemplate() != null && updated.getTemplate().getId() != null) {
                NotificationTemplate template = templateRepository.findById(updated.getTemplate().getId())
                        .orElseThrow(() -> new IllegalArgumentException("Invalid template ID"));
                existing.setTemplate(template);
            }
            existing.setTriggerType(updated.getTriggerType());
            existing.setTimingOffset(updated.getTimingOffset());
            existing.setTypeOfTiming(updated.getTypeOfTiming());
            existing.setTargetCondition(updated.getTargetCondition());
            existing.setActive(updated.isActive());
            return ResponseEntity.ok(scheduleRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        scheduleRepository.deleteById(id);
    }
}
