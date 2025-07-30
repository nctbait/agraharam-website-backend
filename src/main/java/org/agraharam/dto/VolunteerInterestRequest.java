package org.agraharam.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class VolunteerInterestRequest {
    private Long memberId;
    private String relationship;
    private List<Long> events = new ArrayList<>();

    private List<Long> committees = new ArrayList<>();

}
