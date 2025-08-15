package org.agraharam.controller;

import org.agraharam.dto.HomeAdminRequest;
import org.agraharam.dto.HomePageResponse;
import org.agraharam.service.HomeContentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api")
public class HomeController {
    private final HomeContentService svc;

    public HomeController(HomeContentService svc) {
        this.svc = svc;
    }

    // Public endpoint used by HomePage.jsx
    @GetMapping("/public/home")
    public HomePageResponse getPublicHome() {
        return svc.getPublicHome();
    }

    // Admin edit screen can load current values
    @GetMapping("/admin/home")
    @PreAuthorize("hasAuthority('superAdmin')")
    public HomeAdminRequest getAdminHome() {
        return svc.getAdminHome();
    }

    // Admin saves updates
    @PutMapping("/admin/home")
    @PreAuthorize("hasAuthority('superAdmin')")
    public void saveAdminHome(@RequestBody HomeAdminRequest req, Principal principal) {
        svc.saveAdminHome(req, principal != null ? principal.getName() : "unknown");
    }
}