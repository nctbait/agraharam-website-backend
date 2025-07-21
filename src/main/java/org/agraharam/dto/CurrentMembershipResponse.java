package org.agraharam.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CurrentMembershipResponse {
    private String membershipName;
    private LocalDate startDate;
    private LocalDate endDate;

    public CurrentMembershipResponse(String membershipName, LocalDate startDate, LocalDate endDate) {
        this.membershipName = membershipName;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    // Getters and Setters
}

