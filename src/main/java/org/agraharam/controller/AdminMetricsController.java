package org.agraharam.controller;

import org.agraharam.dto.AdminMetricsDTO;
import org.agraharam.service.AdminMetricsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// AdminMetricsController.java
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
public class AdminMetricsController {

    private final AdminMetricsService metricsService;

    public AdminMetricsController(AdminMetricsService metricsService) {
        this.metricsService = metricsService;
    }

    @GetMapping("/metrics")
    public ResponseEntity<AdminMetricsDTO> getMetrics() {
        return ResponseEntity.ok(metricsService.getMetrics());
    }
}

