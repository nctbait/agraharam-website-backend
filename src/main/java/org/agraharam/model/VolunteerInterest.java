package org.agraharam.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "volunteer_interest")
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
public class VolunteerInterest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The user who submitted (optional: for audit)
    private Long userId;

    // The actual family member volunteering
    private Long familyMemberId;

    private String relationship;

    private Long familyId;

    private Long eventId; // Nullable

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "committee_id", nullable = true)
    private VolunteerCommittee committee;

    private LocalDateTime submittedAt;

    public VolunteerInterest(Long memberId, String relationship, Long eventId, VolunteerCommittee committee, LocalDateTime submittedAt, Long familyId) {
        this.familyMemberId = memberId;
        this.relationship = relationship;
        this.eventId = eventId;
        this.committee = committee;
        this.submittedAt = submittedAt;
        this.familyId = familyId;
    }
    
}
