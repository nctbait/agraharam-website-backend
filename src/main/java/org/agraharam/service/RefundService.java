package org.agraharam.service;

import org.agraharam.dto.ApproveRefundRequest;
import org.agraharam.dto.CreateRefundRequest;
import org.agraharam.dto.ProcessRefundRequest;
import org.agraharam.dto.RefundDTO;
import org.agraharam.dto.mapper.RefundMapper;
import org.agraharam.enums.RefundReferenceType;
import org.agraharam.enums.RefundStatus;
import org.agraharam.model.Refund;
import org.agraharam.model.User;
import org.agraharam.repository.RefundRepository;
import org.agraharam.repository.UserRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.time.OffsetDateTime;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class RefundService {

    private final RefundRepository refundRepo;
    private final AuditLogService audit; 
    private final UserRepository userRepo;

    @Transactional
    public RefundDTO create(CreateRefundRequest req, String creatorEmail) {
        
        var r = Refund.builder()
                .referenceType(req.referenceType())
                .referenceId(req.referenceId())
                .originalPaymentId(req.originalPaymentId())
                .requesterUserId(req.requesterUserId())
                .amountRequested(req.amountRequested())
                .status(RefundStatus.REQUESTED)
                .reason(req.reason())
                .build();
        refundRepo.save(r);
        User user = userRepo.findByEmail(creatorEmail).orElse(null);
        audit.log("REFUND_CREATE",user.getEmail(),"Refund",String.valueOf(r.getId()),"Refund Request created" );
        return RefundMapper.toDto(r);
    }

    @Transactional
    public RefundDTO approve(Long id, String approverEmail, ApproveRefundRequest req) {
        User user = userRepo.findByEmail(approverEmail).orElse(null);
        var r = refundRepo.getForUpdate(id).orElseThrow(() -> new IllegalArgumentException("Refund not found"));
        if (r.getStatus() != RefundStatus.REQUESTED)
            throw new IllegalStateException("Only REQUESTED refunds can be approved");
        if (Objects.equals(r.getRequesterUserId(), user.getId())) {
            // if requesterUserId is the creator (when created by member) you may still allow admin approver; adjust if you store creator id separately
        }
        if (req.amountApproved().compareTo(r.getAmountRequested()) > 0)
            throw new IllegalArgumentException("Approved amount cannot exceed requested amount");
        r.setAmountApproved(req.amountApproved());
        r.setStatus(RefundStatus.APPROVED);
        r.setApprovedByUserId(user.getId());
        if (req.note() != null && !req.note().isBlank()) {
            var base = r.getReason() == null ? "" : r.getReason() + "\n";
            r.setReason(base + "Approved note: " + req.note());
        }
        //User user = userRepo.findByEmail(approverEmail).orElse(null);
        audit.log("REFUND_APPROVED",user.getEmail(),"Refund",String.valueOf(r.getId()),"Refund Request Approved" );
        return RefundMapper.toDto(r);
    }

    @Transactional
    public RefundDTO reject(Long id, String approverEmail, String reason) {
        User user = userRepo.findByEmail(approverEmail).orElse(null);
        var r = refundRepo.getForUpdate(id).orElseThrow(() -> new IllegalArgumentException("Refund not found"));
        if (r.getStatus() != RefundStatus.REQUESTED)
            throw new IllegalStateException("Only REQUESTED refunds can be rejected");
        r.setStatus(RefundStatus.REJECTED);
        r.setApprovedByUserId(user.getId());
        var base = r.getReason() == null ? "" : r.getReason() + "\n";
        r.setReason(base + "Rejection reason: " + reason);
        audit.log("REFUND_REJECTED",user.getEmail(),"Refund",String.valueOf(r.getId()),"Refund Request Rejected" );

        return RefundMapper.toDto(r);
    }

    @Transactional
    public RefundDTO process(Long id, String processorEmail, ProcessRefundRequest req) {
        User user = userRepo.findByEmail(processorEmail).orElse(null);
        var r = refundRepo.getForUpdate(id).orElseThrow(() -> new IllegalArgumentException("Refund not found"));
        if (r.getStatus() != RefundStatus.APPROVED)
            throw new IllegalStateException("Only APPROVED refunds can be processed");
        if (r.getApprovedByUserId() != null && Objects.equals(r.getApprovedByUserId(), user.getId()))
            throw new IllegalStateException("Approver cannot be the processor");
        if (r.getAmountApproved() == null)
            throw new IllegalStateException("amountApproved must be set before processing");
        r.setMethod(req.method());
        r.setPayoutRef(req.payoutRef());
        r.setProcessedByUserId(user.getId());
        r.setProcessedAt(OffsetDateTime.now());
        r.setStatus(RefundStatus.PROCESSED);
        audit.log("REFUND_PROCESSED",user.getEmail(),"Refund",String.valueOf(r.getId()),"Refund Request Processed" );

        return RefundMapper.toDto(r);
    }

    @Transactional(readOnly = true)
    public RefundDTO get(Long id) {
        var r = refundRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Refund not found"));
        return RefundMapper.toDto(r);
    }

    @Transactional(readOnly = true)
    public Page<RefundDTO> list(
            RefundStatus status,
            RefundReferenceType refType,
            Long refId,
            int page,
            int size
    ) {
        var pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100), Sort.by("createdAt").descending());
        if (status == null && refType == null && refId == null) {
            return refundRepo.findAll(pageable).map(RefundMapper::toDto);
        }
        return refundRepo.findAll((root, q, cb) -> cb.and(
                status == null ? cb.conjunction() : cb.equal(root.get("status"), status),
                refType == null ? cb.conjunction() : cb.equal(root.get("referenceType"), refType),
                refId == null ? cb.conjunction() : cb.equal(root.get("referenceId"), refId)
        ), pageable).map(RefundMapper::toDto);
    }
}