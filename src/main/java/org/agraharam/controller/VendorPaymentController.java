package org.agraharam.controller;

import java.security.Principal;

import org.agraharam.dto.ApproveVendorPaymentRequest;
import org.agraharam.dto.CreateVendorPaymentRequest;
import org.agraharam.dto.MarkPaidRequest;
import org.agraharam.dto.RejectRequest;
import org.agraharam.dto.VendorPaymentDTO;
import org.agraharam.enums.VendorPaymentStatus;
import org.agraharam.service.VendorPaymentService;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/vendor-payments")
@RequiredArgsConstructor
public class VendorPaymentController {

    private final VendorPaymentService service;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('admin','superAdmin')")
    public VendorPaymentDTO create(@Valid @RequestBody CreateVendorPaymentRequest req, Principal auth) {
        return service.create(req, auth.getName());
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('admin','superAdmin')")
    public Page<VendorPaymentDTO> list(@RequestParam(required = false) Long vendorId,
                                       @RequestParam(required = false) Long eventId,
                                       @RequestParam(required = false) VendorPaymentStatus status,
                                       @RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "20") int size) {
        return service.list(vendorId, eventId, status, page, size);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin','superAdmin')")
    public VendorPaymentDTO get(@PathVariable Long id) {
        return service.get(id);
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyAuthority('admin','superAdmin')")
    public VendorPaymentDTO approve(@PathVariable Long id,
                                    @Valid @RequestBody(required = false) ApproveVendorPaymentRequest req,
                                    Principal auth) {
        var note = req != null ? req.note() : null;
        return service.approve(id, auth.getName(), note);
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyAuthority('admin','superAdmin')")
    public VendorPaymentDTO reject(@PathVariable Long id,
                                   @Valid @RequestBody RejectRequest req,
                                   Principal auth) {
        return service.reject(id, auth.getName(), req.reason());
    }

    @PutMapping("/{id}/mark-paid")
    @PreAuthorize("hasAnyAuthority('admin','superAdmin')")
    public VendorPaymentDTO markPaid(@PathVariable Long id,
                                     @Valid @RequestBody MarkPaidRequest req,
                                     Principal auth) {
        return service.markPaid(id, auth.getName(), req.transactionRef());
    }

    
}
