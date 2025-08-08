package org.agraharam.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "donation")
@Getter
@Setter
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;         // null if guest
    private Long familyId;       // if known
    private String donorName;
    private String phone;
    private String email;
    private String reason;
    private Double amount;
    private String paymentMethod; // "ZELLE" or "PAYPAL"
    private String confirmationCode;
    private String status;       // "pending", "approved", "rejected"

    private LocalDateTime submittedAt = LocalDateTime.now();
}
 