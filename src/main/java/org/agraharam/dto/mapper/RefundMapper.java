package org.agraharam.dto.mapper;

import org.agraharam.dto.RefundDTO;
import org.agraharam.model.Refund;

public final class RefundMapper {
    private RefundMapper() {}

    public static RefundDTO toDto(Refund r) {
        return new RefundDTO(
                r.getId(),
                r.getOriginalPaymentId(),
                r.getReferenceType(),
                r.getReferenceId(),
                r.getRequesterUserId(),
                r.getAmountRequested(),
                r.getAmountApproved(),
                r.getStatus(),
                r.getMethod(),
                r.getReason(),
                r.getPayoutRef(),
                r.getApprovedByUserId(),
                r.getProcessedByUserId(),
                r.getProcessedAt(),
                r.getCreatedAt(),
                r.getUpdatedAt()
        );
    }
}
