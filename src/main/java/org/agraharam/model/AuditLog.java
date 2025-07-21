package org.agraharam.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action;
    private String actorEmail;
    private String targetType;
    private String targetId;
    private String details;
    private String ipAddress;
    private String userAgent;


    private String batchId; // Optional for bulk operations
    private LocalDateTime timestamp;

    // Constructors
    public AuditLog() {}

    public AuditLog(String action, String actorEmail, String targetType, String targetId, String details,String ipAddress,String userAgent) {
        this.action = action;
        this.actorEmail = actorEmail;
        this.targetType = targetType;
        this.targetId = targetId;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and setters
    // (Can be generated using your IDE or Lombok)
}

