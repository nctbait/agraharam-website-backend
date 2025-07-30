package org.agraharam.dto;

import org.agraharam.model.VolunteerCommittee;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommitteeDTO {
    private Long id;
    private String name;

    public static CommitteeDTO fromEntity(VolunteerCommittee committee) {
        return new CommitteeDTO(committee.getId(), committee.getName());
    }
}
