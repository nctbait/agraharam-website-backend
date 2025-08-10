package org.agraharam.service;

import java.security.Principal;

import org.agraharam.dto.CreateVendorRequest;
import org.agraharam.dto.UpdateVendorRequest;
import org.agraharam.dto.VendorDTO;
import org.agraharam.dto.mapper.VendorMapper;
import org.agraharam.model.Vendor;
import org.agraharam.repository.VendorRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;

    @Transactional
    public VendorDTO create(CreateVendorRequest req) {
        var v = Vendor.builder()
                .name(req.name())
                .contactName(req.contactName())
                .phone(req.phone())
                .email(req.email())
                .address(req.address())
                .build();
        // If you want to track creator:
        // v.setCreatedByUserId(creatorUserId);
        vendorRepository.save(v);
        return VendorMapper.toDto(v);
    }

    @Transactional(readOnly = true)
    public Page<VendorDTO> list(String q, int page, int size) {
        var pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100), Sort.by("name").ascending());
        Page<Vendor> data = (q == null || q.isBlank())
                ? vendorRepository.findAll(pageable)
                : new PageImpl<>(vendorRepository.findByNameContainingIgnoreCase(q), pageable, 0); // simple search
        return data.map(VendorMapper::toDto);
    }

    @Transactional(readOnly = true)
    public VendorDTO get(Long id) {
        var v = vendorRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Vendor not found"));
        return VendorMapper.toDto(v);
    }

    @Transactional
    public VendorDTO update(Long id, UpdateVendorRequest req) {
        var v = vendorRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Vendor not found"));
        VendorMapper.applyUpdate(v, req.name(), req.contactName(), req.phone(), req.email(), req.address());
        return VendorMapper.toDto(v);
    }
}