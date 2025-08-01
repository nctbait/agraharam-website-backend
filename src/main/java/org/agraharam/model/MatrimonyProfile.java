package org.agraharam.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "matrimony_profile")
public class MatrimonyProfile {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;
  private String gender;
  private String gothram;
  private String vedam;
  private String sakha;
  private String maritalStatus;
  private LocalDate dateOfBirth;
  private LocalTime timeOfBirth;
  private String placeOfBirth;
  private String nakshatram;
  private String paadam;
  private String raasi;
  private String height;
  private String occupation;
  private String education;
  private String immigrationStatus;
  private String fatherName;
  private String motherName;
  private String motherMaidenName;
  private String fatherOccupation;
  private String motherOccupation;
  private String contactPhone;
  private String contactEmail;
  private String currentLocation;
  private String willingToRelocate;
  @Lob
  @Column(name = "about", columnDefinition = "TEXT")
  private String about;
  @Lob
  @Column(name = "requirements", columnDefinition = "TEXT")
  private String requirements;
  private String imageDisplayPreference;
  private String profilePictureUrl;

  private String status = "pending";

  private Long familyId;

  private LocalDateTime createdAt = LocalDateTime.now();
}

