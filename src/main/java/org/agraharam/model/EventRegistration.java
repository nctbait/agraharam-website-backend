package org.agraharam.model;

import java.util.ArrayList;
import java.util.List;

import org.agraharam.enums.EventStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class EventRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Event event;

    @ManyToOne
    private User user;

    @ManyToMany
    private List<User> users = new ArrayList<>(); // Primary, Spouse

    @ManyToMany
    private List<FamilyMember> familyMembers = new ArrayList<>(); //children

    @OneToMany(mappedBy = "registration", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Guest> guests = new ArrayList<>();

    private String zelleConfirmation;

    @OneToMany(mappedBy = "registration", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EventOfferingSelection> offerings = new ArrayList<>();
    
    @Enumerated(EnumType.STRING)
    private EventStatus status; // e.g., CONFIRMED, CANCELLED, WAITLISTED, SUBMITTED

    // Getters and setters
}

