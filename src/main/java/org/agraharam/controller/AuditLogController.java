package org.agraharam.controller;

import java.util.List;

import org.agraharam.model.AuditLog;
import org.agraharam.service.AuditLogServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/audit")
public class AuditLogController {

    @Autowired
    private AuditLogServiceImpl auditLogService;

    @GetMapping("logs")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    public ResponseEntity<Page<AuditLog>> getAuditLogs(
            @RequestParam(value = "exclude", required = false) List<String> exclude,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {
        return ResponseEntity.ok(auditLogService.getFilteredAuditLogs(exclude, page, size));
    }

}
