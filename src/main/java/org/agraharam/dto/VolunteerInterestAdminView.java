package org.agraharam.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class VolunteerInterestAdminView {
    private Long memberId;
    private String memberName;
    private String relationship;
    private String email;
    private String phone;

    private List<EventDTO> events = new ArrayList<>();
    private List<CommitteeDTO> committees = new ArrayList<>();
}