// dto/reports/TaskCompletedRow.java
package org.agraharam.dto.reports;

import org.agraharam.model.Task;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record TaskCompletedRow(
        Long taskId,
        String name,
        String assignee,
        String status,
        LocalDate deadline,
        LocalDateTime createdAt,
        String eventTitle
) {
    public static TaskCompletedRow from(Task t) {
        String assignee = t.getAssignedTo() != null
                ? (t.getAssignedTo().getFirstName() + " " + t.getAssignedTo().getLastName())
                : "";
        String eventTitle = t.getEvent() != null ? t.getEvent().getTitle() : "";
        return new TaskCompletedRow(
                t.getId(),
                t.getName(),
                assignee,
                t.getStatus(),
                t.getDeadline(),
                t.getCreatedAt(),
                eventTitle
        );
    }
}
