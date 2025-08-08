package org.agraharam.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.agraharam.model.Subtask;

import lombok.Data;
@Data
public class SubtaskDTO {
    private Long id;
    private String name;
    private String description;
    private String status;
    private LocalDate deadline;
    private Long assignedToId;
    private String assignedToName;
    private LocalDateTime createDateTime;

    private Long parentTaskId;

    public static SubtaskDTO fromEntity(Subtask subtask) {
        SubtaskDTO dto = new SubtaskDTO();
        dto.setId(subtask.getId());
        dto.setName(subtask.getName());
        dto.setDescription(subtask.getDescription());
        dto.setStatus(subtask.getStatus());
        dto.setDeadline(subtask.getDeadline());

        if (subtask.getAssignedTo() != null) {
            dto.setAssignedToId(subtask.getAssignedTo().getId());
            dto.setAssignedToName(subtask.getAssignedTo().getFirstName() + " " + subtask.getAssignedTo().getLastName());
        }

        if (subtask.getParentTask() != null) {
            dto.setParentTaskId(subtask.getParentTask().getId());
        }
        dto.setCreateDateTime(subtask.getCreatedAt());

        return dto;
    }
}