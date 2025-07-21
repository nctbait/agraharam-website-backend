package org.agraharam.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "user_payment")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Double amount;

    private LocalDateTime paymentDate;
    private String paymentType;     // membership, event, donation, etc.
    private Long referenceId;       // Could point to eventId or membershipId
    private String description;
    private Boolean taxDeductible = true;

    private LocalDateTime createdAt = LocalDateTime.now();
    private String confirmation;   // generic confirmation number
    private String recipientName;  // paid-to info
    private String status;         // pending, approved, rejected
    
    // Getters and setters
}
