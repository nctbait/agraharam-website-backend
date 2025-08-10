package org.agraharam.controller;

import java.security.Principal;

import org.agraharam.dto.ApproveRefundRequest;
import org.agraharam.dto.CreateRefundRequest;
import org.agraharam.dto.ProcessRefundRequest;
import org.agraharam.dto.RefundDTO;
import org.agraharam.dto.RejectRefundRequest;
import org.agraharam.enums.RefundReferenceType;
import org.agraharam.enums.RefundStatus;
import org.agraharam.service.RefundService;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/refunds")
@RequiredArgsConstructor
public class RefundController {

    private final RefundService service;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('admin','superAdmin')")
    public RefundDTO create(@Valid @RequestBody CreateRefundRequest req, Principal auth) {
        return service.create(req, auth.getName());
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('admin','superAdmin')")
    public Page<RefundDTO> list(@RequestParam(required = false) RefundStatus status,
                                @RequestParam(required = false) RefundReferenceType referenceType,
                                @RequestParam(required = false) Long referenceId,
                                @RequestParam(defaultValue = "0") int page,
                                @RequestParam(defaultValue = "20") int size) {
        return service.list(status, referenceType, referenceId, page, size);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin','superAdmin')")
    public RefundDTO get(@PathVariable Long id) {
        return service.get(id);
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyAuthority('admin','superAdmin')")
    public RefundDTO approve(@PathVariable Long id,
                             @Valid @RequestBody ApproveRefundRequest req,
                             Principal auth) {
        return service.approve(id, auth.getName(), req);
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyAuthority('admin','superAdmin')")
    public RefundDTO reject(@PathVariable Long id,
                            @Valid @RequestBody RejectRefundRequest req,
                            Principal auth) {
        return service.reject(id, auth.getName(), req.reason());
    }

    @PutMapping("/{id}/process")
    @PreAuthorize("hasAnyAuthority('admin','superAdmin')")
    public RefundDTO process(@PathVariable Long id,
                             @Valid @RequestBody ProcessRefundRequest req,
                             Principal auth) {
        return service.process(id, auth.getName(), req);
    }
}
