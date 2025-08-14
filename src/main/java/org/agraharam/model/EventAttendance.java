package org.agraharam.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Getter @Setter
@Table(name = "event_attendance",
       uniqueConstraints = {
         @UniqueConstraint(name = "uk_attendance_reg_src", columnNames = {
           "registration_id", "person_type", "source_id", "name"
         })
       })
public class EventAttendance {

    public enum PersonType { PRIMARY_USER, USER, FAMILY_MEMBER, GUEST }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // denorm for fast queries
    @Column(nullable = false)
    private Long eventId;

    @Column(nullable = false)
    private Long registrationId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PersonType personType;

    // optional “source” link (User.id / FamilyMember.id / Guest.id). Guests might not have an id at creation time—keep nullable.
    private Long sourceId;

    @Column(nullable = false, length = 200)
    private String name;          // display name at check-in time

    @Column(length = 60)
    private String relation;      // Primary, Spouse, Child, Guest, etc.

    @Column(nullable = false)
    private boolean checkedIn = false;

    @Column(nullable = false, columnDefinition = "timestamp")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(columnDefinition = "timestamp")
    private OffsetDateTime checkedInAt;
}
