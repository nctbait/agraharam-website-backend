package org.agraharam.model;

import jakarta.persistence.*;
import lombok.*;

import org.agraharam.enums.PaymentMethod;
import org.agraharam.enums.RefundReferenceType;
import org.agraharam.enums.RefundStatus;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "refund", indexes = {
    @Index(name = "ix_ref_reference", columnList = "referenceType,referenceId"),
    @Index(name = "ix_ref_status", columnList = "status"),
    @Index(name = "ix_ref_original_payment", columnList = "originalPaymentId")
})
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Refund {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Optional link to your existing payment record (member/event/donation), if known */
    private Long originalPaymentId;

    /** What this refund is for (e.g., EVENT_REGISTRATION in future) */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private RefundReferenceType referenceType;

    /** The id in that referenced table (e.g., event_registration.id later) */
    @Column(nullable = false)
    private Long referenceId;

    /** Who asked for it (null if purely admin-initiated) */
    private Long requesterUserId;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amountRequested;

    @Column(precision = 12, scale = 2)
    private BigDecimal amountApproved;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private RefundStatus status = RefundStatus.REQUESTED;

    /** How you’ll pay it back; can be set on approve */
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private PaymentMethod method;

    /** Optional human-readable explanation */
    @Column(length = 800)
    private String reason;

    /** External reference for the payout (PayPal refund id, check #, etc.) */
    @Column(length = 160)
    private String payoutRef;

    private Long approvedByUserId;
    private Long processedByUserId;

    private OffsetDateTime processedAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    private OffsetDateTime updatedAt;
}
