package org.agraharam.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VolunteerHourSummaryDTO {
    private Long memberId;
    private String relationship;
    private String name;
    private Double approvedHours;
    private Double pendingHours;
}