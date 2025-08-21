package org.agraharam.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "contact_message_notes")
public class ContactMessageNote {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "contact_message_id")
  private ContactMessage contactMessage;

  @Column(nullable = false, length = 160)
  private String adminEmail;

  @Column(nullable = false, length = 4000)
  private String body;

  @Column(nullable = false)
  private LocalDateTime createdAt = LocalDateTime.now();

  @Column(nullable = false, length = 20)
  private String channel = "email"; // future: sms, call-log

  // getters/setters
}
