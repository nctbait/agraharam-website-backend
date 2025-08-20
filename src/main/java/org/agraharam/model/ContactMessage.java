package org.agraharam.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

// ContactMessage.java
@Entity
@Getter
@Setter
@Table(name = "contact_message")
public class ContactMessage {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable=false, length=120) private String name;
  @Column(nullable=false, length=160) private String email;
  @Column(length=40) private String phone;
  @Column(nullable=false, length=40) private String committee; // enum string OK
  @Column(nullable=false, length=4000) private String message;

  @Column(nullable=false) private LocalDateTime createdAt = LocalDateTime.now();
  @Column(nullable=false, length=45) private String ip;          // IPv4/6 fits in 45
  @Column(nullable=false, length=255) private String userAgent;

  @Column(nullable=false, length=20) private String status = "new"; // new|in_progress|closed
  @Column(length=255) private String assignedTo; // optional
  // getters/setters…
}
