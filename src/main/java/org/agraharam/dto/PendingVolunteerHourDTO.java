package org.agraharam.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PendingVolunteerHourDTO {
    private Long id;
    private String name;
    private String relationship;
    private LocalDate date;
    private Double hours;
    private String eventName;
    private String committeeName;
    private String description;

    // Constructor, getters, setters
}

