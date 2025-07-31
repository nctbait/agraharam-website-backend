package org.agraharam.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VolunteerHourRequest {
    private Long memberId;
    private String relationship;
    private LocalDate date;
    private LocalTime startTime;
    private Double hours;
    private Long eventId;
    private Long committeeId;
    private String description;
}

