package org.agraharam.model;

import jakarta.persistence.*;
import lombok.*;

import org.agraharam.enums.AttachmentOwnerType;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "attachment", indexes = {
    @Index(name = "ix_att_owner", columnList = "ownerType,ownerId")
})
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Attachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Generic pointer to whatever owns this file (Refund, VendorPayment, etc.) */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private AttachmentOwnerType ownerType;

    @Column(nullable = false)
    private Long ownerId;

    /** Original filename & MIME */
    @Column(nullable = false, length = 260)
    private String filename;

    @Column(length = 120)
    private String contentType;

    /** Size in bytes */
    private Long size;

    /**
     * Storage pointer – e.g., S3 key, local path, or UUID in your file store.
     * Keep this as the canonical locator; URL can be derived at runtime.
     */
    @Column(nullable = false, length = 300)
    private String storageKey;

    /** Optional integrity check */
    @Column(length = 64)
    private String sha256;

    private Long uploadedByUserId;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;
}
