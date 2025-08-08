package org.agraharam.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.agraharam.dto.TaskDTO;
import org.agraharam.exception.NotFoundException;
import org.agraharam.model.Event;
import org.agraharam.model.Task;
import org.agraharam.model.User;
import org.agraharam.repository.EventRepository;
import org.agraharam.repository.TaskRepository;
import org.agraharam.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

    @Autowired private  TaskRepository taskRepo;
    @Autowired private  UserRepository userRepo;
    @Autowired private  EventRepository eventRepo;

    public List<TaskDTO> getAll() {
        return taskRepo.findAll().stream()
                .map(TaskDTO::fromEntity)
                .toList();
    }

    public List<TaskDTO> getTasksByStatus(String status) {
        return taskRepo.findByStatus(status).stream()
                .map(TaskDTO::fromEntity)
                .toList();
    }


    public TaskDTO getById(Long id) {
        Task task = taskRepo.findById(id).orElseThrow(() -> new NotFoundException("Task not found"));
        return TaskDTO.fromEntity(task);
    }

    public void save(TaskDTO dto) {
        Task task = fromDto(dto);
        taskRepo.save(task);
    }

    public void update(Long id, TaskDTO dto) {
        Task task = taskRepo.findById(id).orElseThrow(() -> new NotFoundException("Task not found"));
        updateFromDto(task, dto);
        taskRepo.save(task);
    }

    public void delete(Long id) {
        taskRepo.deleteById(id);
    }

    private Task fromDto(TaskDTO dto) {
        Task task = new Task();
        updateFromDto(task, dto);
        return task;
    }

    private void updateFromDto(Task task, TaskDTO dto) {
        task.setName(dto.getName());
        task.setDescription(dto.getDescription());
        task.setStatus(dto.getStatus());
        task.setDeadline(dto.getDeadline());

        if (dto.getAssignedToId() != null) {
            User user = userRepo.findById(dto.getAssignedToId()).orElseThrow(() -> new NotFoundException("User not found"));
            task.setAssignedTo(user);
        } else {
            task.setAssignedTo(null);
        }

        if (dto.getEventId() != null) {
            Event event = eventRepo.findById(dto.getEventId()).orElseThrow(() -> new NotFoundException("Event not found"));
            task.setEvent(event);
        } else {
            task.setEvent(null);
        }
    }

public Page<TaskDTO> getPaginatedTasks(String status, LocalDate startDate, LocalDate endDate, Pageable pageable) {
    Specification<Task> spec = Specification.where(null);

    if (status != null && !status.isBlank()) {
        spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
    }

    if (startDate != null) {
        spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("createdAt"), startDate.atStartOfDay()));
    }

    if (endDate != null) {
        spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("createdAt"), endDate.atTime(LocalTime.MAX)));
    }

    Page<Task> tasks = taskRepo.findAll(spec, pageable);
    return tasks.map(TaskDTO::fromEntity);
}

}

