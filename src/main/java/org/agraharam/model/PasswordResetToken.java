package org.agraharam.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "password_reset_token", indexes = {
        @Index(name = "ix_prt_token_hash", columnList = "token_hash"),
        @Index(name = "ix_prt_user", columnList = "user_id")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** FK to users.id (kept simple as a scalar to avoid accidental fetches) */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** Hex(sha256(rawToken)) -> 64 chars */
    @Column(name = "token_hash", nullable = false, length = 64)
    private String tokenHash;

    @Column(name = "expires_at", nullable = false)
    private OffsetDateTime expiresAt;

    @Column(name = "used_at")
    private OffsetDateTime usedAt;

    @Column(name = "request_ip", length = 64)
    private String requestIp;

    @Column(name = "request_user_agent", length = 200)
    private String requestUserAgent;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    /** Helper */
    public boolean isUsable(OffsetDateTime now) {
        return usedAt == null && (expiresAt == null || expiresAt.isAfter(now));
    }

    public PasswordResetToken(Long userId, String tokenHash, OffsetDateTime expiresAt, OffsetDateTime usedAt,
            String requestIp, String requestUserAgent, OffsetDateTime createdAt) {
        this.userId = userId;
        this.tokenHash = tokenHash;
        this.expiresAt = expiresAt;
        this.usedAt = usedAt;
        this.requestIp = requestIp;
        this.requestUserAgent = requestUserAgent;
        this.createdAt = createdAt;
    }

}
