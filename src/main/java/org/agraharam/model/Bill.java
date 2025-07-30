package org.agraharam.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long memberId;
    private String memberRelation;
    private Double amount;
    private String description;

    private Long eventId;
    private String zelleId;
    private String zelleName;

    private String filePath;
    private LocalDate submittedDate = LocalDate.now();
    private String status = "pending"; // can be 'pending', 'approved', 'rejected'
    
}
