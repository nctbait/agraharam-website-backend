package org.agraharam.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "volunteer_hour")
@Data
public class VolunteerHour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long memberId;

    private String relationship;

    private LocalDate date;

    private LocalTime startTime;

    private Double hours;

    private Long eventId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "committee_id")
    private VolunteerCommittee committee;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Long familyId;

    private String status; // "pending", "approved", etc.

    private LocalDateTime submittedAt;

    private Long userId; // who submitted
}
