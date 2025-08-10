package org.agraharam.dto.mapper;

import org.agraharam.dto.VendorPaymentDTO;
import org.agraharam.model.VendorPayment;

public final class VendorPaymentMapper {
    private VendorPaymentMapper() {}

    public static VendorPaymentDTO toDto(VendorPayment vp) {
        var vendor = vp.getVendor();
        var event = vp.getEvent();
        return new VendorPaymentDTO(
                vp.getId(),
                vendor != null ? vendor.getId() : null,
                vendor != null ? vendor.getName() : null,
                event != null ? event.getId() : null,
                event != null ? event.getTitle() : null,
                vp.getInvoiceNumber(),
                vp.getDescription(),
                vp.getAmount(),
                vp.getPaymentMethod(),
                vp.getStatus(),
                vp.getCreatedByUserId(),
                vp.getApprovedByUserId(),
                vp.getPaidByUserId(),
                vp.getApprovedAt(),
                vp.getPaidAt(),
                vp.getTransactionRef(),
                vp.getCreatedAt(),
                vp.getUpdatedAt()
        );
    }
}
