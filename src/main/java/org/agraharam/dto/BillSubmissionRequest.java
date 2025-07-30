package org.agraharam.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class BillSubmissionRequest {
    private Long memberId;
    private String memberRelation;
    private Double amount;
    private String description;
    private Long eventId; // optional
    private String zelleId;
    private String zelleName;

    // Getters and setters
}
