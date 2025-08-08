package org.agraharam.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.agraharam.model.Task;

import lombok.Data;

@Data
public class TaskDTO {
    private Long id;
    private String name;
    private String description;
    private String status;
    private LocalDate deadline;

    private Long assignedToId;
    private String assignedToName;

    private Long eventId;
    private String eventTitle;
    private LocalDateTime createDateTime;

    private List<SubtaskDTO> subtasks; // optional

    public static TaskDTO fromEntity(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setName(task.getName());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setDeadline(task.getDeadline());

        if (task.getAssignedTo() != null) {
            dto.setAssignedToId(task.getAssignedTo().getId());
            dto.setAssignedToName(task.getAssignedTo().getFirstName() + " " + task.getAssignedTo().getLastName());
        }

        if (task.getEvent() != null) {
            dto.setEventId(task.getEvent().getId());
            dto.setEventTitle(task.getEvent().getTitle());
        }

        if (task.getSubtasks() != null) {
            dto.setSubtasks(
                task.getSubtasks().stream()
                    .map(SubtaskDTO::fromEntity)
                    .collect(Collectors.toList())
            );
        }

        dto.setCreateDateTime(task.getCreatedAt());

        return dto;
    }
}

