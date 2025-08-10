package org.agraharam.model;

import jakarta.persistence.*;
import lombok.*;

import org.agraharam.enums.PaymentMethod;
import org.agraharam.enums.VendorPaymentStatus;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "vendor_payment", indexes = {
        @Index(name = "ix_vp_vendor_id", columnList = "vendor_id"),
        @Index(name = "ix_vp_status", columnList = "status"),
        @Index(name = "ix_vp_invoice", columnList = "invoiceNumber")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** FK -> vendor.id */
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @Column(length = 80)
    private String invoiceNumber;

    @Column(length = 600)
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private VendorPaymentStatus status = VendorPaymentStatus.PENDING;
    private Long createdByUserId;
    /** Admin user ids – keep as raw ids to avoid coupling to User entity */
    private Long approvedByUserId;
    private Long paidByUserId;

    private OffsetDateTime approvedAt;
    private OffsetDateTime paidAt;

    /**
     * Optional external transaction reference (Zelle note, check #, PayPal capture
     * id, etc.)
     */
    @Column(length = 120)
    private String transactionRef;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    private OffsetDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "event_id")
    private Event event; // null => general/non-event expense
}
