package org.agraharam.repository.specs;


import org.agraharam.enums.RefundReferenceType;
import org.agraharam.enums.RefundStatus;
import org.agraharam.enums.VendorPaymentStatus;
import org.agraharam.model.Refund;
import org.agraharam.model.VendorPayment;
import org.springframework.data.jpa.domain.Specification;

import java.time.OffsetDateTime;
import java.util.List;

public final class Specs {

    private Specs() {}

    public static Specification<VendorPayment> vendorPaymentFilter(
            Long vendorId,
            List<VendorPaymentStatus> statuses,
            OffsetDateTime createdFrom,
            OffsetDateTime createdTo
    ) {
        return (root, q, cb) -> cb.and(
            vendorId == null ? cb.conjunction() : cb.equal(root.get("vendor").get("id"), vendorId),
            (statuses == null || statuses.isEmpty()) ? cb.conjunction() : root.get("status").in(statuses),
            createdFrom == null ? cb.conjunction() : cb.greaterThanOrEqualTo(root.get("createdAt"), createdFrom),
            createdTo == null ? cb.conjunction() : cb.lessThanOrEqualTo(root.get("createdAt"), createdTo)
        );
    }

    public static Specification<Refund> refundFilter(
            RefundReferenceType refType,
            Long refId,
            List<RefundStatus> statuses
    ) {
        return (root, q, cb) -> cb.and(
            refType == null ? cb.conjunction() : cb.equal(root.get("referenceType"), refType),
            refId == null ? cb.conjunction() : cb.equal(root.get("referenceId"), refId),
            (statuses == null || statuses.isEmpty()) ? cb.conjunction() : root.get("status").in(statuses)
        );
    }
}


/*
 * 
 * var vp = vendorPaymentRepository.getForUpdate(id)
    .orElseThrow();
vp.setStatus(VendorPaymentStatus.APPROVED);
vp.setApprovedByUserId(adminId);
vp.setApprovedAt(OffsetDateTime.now());

// List pending refunds (paged)
var pending = refundRepository.findByStatus(RefundStatus.REQUESTED, PageRequest.of(0, 20));

// All attachments for a refund
var files = attachmentRepository.findAllByOwner(AttachmentOwnerType.REFUND, refundId);
 */