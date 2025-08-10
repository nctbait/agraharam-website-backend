package org.agraharam.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.agraharam.dto.CreateVendorRequest;
import org.agraharam.dto.UpdateVendorRequest;
import org.agraharam.dto.VendorDTO;
import org.agraharam.service.VendorService;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;



    @PostMapping
    @PreAuthorize("hasAnyAuthority('admin','superAdmin')")
    public VendorDTO create(@Valid @RequestBody CreateVendorRequest req) {
        return vendorService.create(req);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('admin','superAdmin')")
    public Page<VendorDTO> list(@RequestParam(required = false) String q,
                                @RequestParam(defaultValue = "0") int page,
                                @RequestParam(defaultValue = "20") int size) {
        return vendorService.list(q, page, size);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin','superAdmin')")
    public VendorDTO get(@PathVariable Long id) {
        return vendorService.get(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin','superAdmin')")
    public VendorDTO update(@PathVariable Long id, @Valid @RequestBody UpdateVendorRequest req) {
        return vendorService.update(id, req);
    }

}