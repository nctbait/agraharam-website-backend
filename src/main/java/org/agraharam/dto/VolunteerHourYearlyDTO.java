package org.agraharam.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VolunteerHourYearlyDTO {
    private Long memberId;
    private String relationship;
    private String name;
    private int year;
    private double approvedHours;
}

