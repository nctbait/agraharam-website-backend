package org.agraharam.service;

import org.agraharam.dto.CreateVendorPaymentRequest;
import org.agraharam.dto.VendorPaymentDTO;
import org.agraharam.dto.mapper.VendorPaymentMapper;
import org.agraharam.enums.VendorPaymentStatus;
import org.agraharam.model.Event;
import org.agraharam.model.User;
import org.agraharam.model.Vendor;
import org.agraharam.model.VendorPayment;
import org.agraharam.repository.EventRepository;
import org.agraharam.repository.UserRepository;
import org.agraharam.repository.VendorPaymentRepository;
import org.agraharam.repository.VendorRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import java.time.OffsetDateTime;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class VendorPaymentService {

    private final VendorPaymentRepository vpRepo;
    private final VendorRepository vendorRepo;
    private final EventRepository eventRepo; 
    private final AuditLogService audit; 
    private final UserRepository userRepo;
    
    @Transactional
    public VendorPaymentDTO create(CreateVendorPaymentRequest req, String email) {
        Vendor vendor = vendorRepo.findById(req.vendorId())
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found"));
        Event event = (req.eventId() != null)
                ? eventRepo.findById(req.eventId()).orElse(null)
                : null;
        User user = userRepo.findByEmail(email).orElse(null);  
        var vp = VendorPayment.builder()
                .vendor(vendor)
                .event(event) // Option A: ManyToOne to Event
                .invoiceNumber(req.invoiceNumber())
                .description(req.description())
                .amount(req.amount())
                .paymentMethod(req.paymentMethod())
                .status(VendorPaymentStatus.PENDING)
                .createdByUserId(user.getId())
                .build();
        vpRepo.save(vp);
        audit.log("VENDOR_PAYMENT_CREATE",user.getEmail(),"VendorPayment",String.valueOf(vp.getId()),"Vendont Payment Request created" );
        return VendorPaymentMapper.toDto(vp);
    }

    @Transactional
    public VendorPaymentDTO approve(Long id, String email, String note) {
        User user = userRepo.findByEmail(email).orElse(null); 
        var vp = vpRepo.getForUpdate(id).orElseThrow(() -> new IllegalArgumentException("Vendor payment not found"));
        if (vp.getStatus() != VendorPaymentStatus.PENDING)
            throw new IllegalStateException("Only pending payments can be approved");
        if (Objects.equals(vp.getCreatedByUserId(), user.getId()))
            throw new IllegalStateException("Maker cannot approve");
        vp.setStatus(VendorPaymentStatus.APPROVED);
        vp.setApprovedByUserId(user.getId());
        vp.setApprovedAt(OffsetDateTime.now());
        if (note != null && !note.isBlank()) vp.setTransactionRef(note);
        audit.log("VENDOR_PAYMENT_APPROVE",user.getEmail(),"VendorPayment",String.valueOf(vp.getId()),"Vendont Payment Request Approved" );
        return VendorPaymentMapper.toDto(vp);
    }

    @Transactional
    public VendorPaymentDTO reject(Long id, String email, String reason) {
        User user = userRepo.findByEmail(email).orElse(null);  
        var vp = vpRepo.getForUpdate(id).orElseThrow(() -> new IllegalArgumentException("Vendor payment not found"));
        if (vp.getStatus() != VendorPaymentStatus.PENDING)
            throw new IllegalStateException("Only pending payments can be rejected");
        if (Objects.equals(vp.getCreatedByUserId(), user.getId()))
            throw new IllegalStateException("Maker cannot reject either");
        vp.setStatus(VendorPaymentStatus.REJECTED);
        vp.setApprovedByUserId(user.getId());
        vp.setApprovedAt(OffsetDateTime.now());
        if (reason != null && !reason.isBlank()) vp.setTransactionRef(reason);
        // audit.log("VENDOR_PAYMENT_REJECT", Map.of("vpId", id, "approverId", approverId));
        audit.log("VENDOR_PAYMENT_REJECT",user.getEmail(),"VendorPayment",String.valueOf(vp.getId()),"Vendont Payment Request Rejected" );

        return VendorPaymentMapper.toDto(vp);
    }

    @Transactional
    public VendorPaymentDTO markPaid(Long id, String email, String txRef) {
        User user = userRepo.findByEmail(email).orElse(null);  
        var vp = vpRepo.getForUpdate(id).orElseThrow(() -> new IllegalArgumentException("Vendor payment not found"));
        if (vp.getStatus() != VendorPaymentStatus.APPROVED)
            throw new IllegalStateException("Only approved payments can be marked paid");
        if (Objects.equals(vp.getApprovedByUserId(), user.getId()))
            throw new IllegalStateException("Approver cannot be payer");
        vp.setStatus(VendorPaymentStatus.PAID);
        vp.setPaidByUserId(user.getId());
        vp.setPaidAt(OffsetDateTime.now());
        vp.setTransactionRef(txRef);
        // audit.log("VENDOR_PAYMENT_PAID", Map.of("vpId", id, "payerId", payerId, "txRef", txRef));
        audit.log("VENDOR_PAYMENT_PAID",user.getEmail(),"VendorPayment",String.valueOf(vp.getId()),"Vendont Payment Request Paid" );

        return VendorPaymentMapper.toDto(vp);
    }

    @Transactional(readOnly = true)
    public VendorPaymentDTO get(Long id) {
        var vp = vpRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Vendor payment not found"));
        return VendorPaymentMapper.toDto(vp);
    }

    @Transactional(readOnly = true)
    public Page<VendorPaymentDTO> list(Long vendorId, Long eventId, VendorPaymentStatus status, int page, int size) {
        var pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100), Sort.by("createdAt").descending());
        // Simple dynamic filter using Specification if you prefer; here is a quick JPQL fallback
        if (vendorId == null && eventId == null && status == null) {
            return vpRepo.findAll(pageable).map(VendorPaymentMapper::toDto);
        }
        return vpRepo.findAll((root, q, cb) -> cb.and(
                vendorId == null ? cb.conjunction() : cb.equal(root.get("vendor").get("id"), vendorId),
                eventId == null ? cb.conjunction() : cb.equal(root.get("event").get("id"), eventId),
                status == null ? cb.conjunction() : cb.equal(root.get("status"), status)
        ), pageable).map(VendorPaymentMapper::toDto);
    }
}