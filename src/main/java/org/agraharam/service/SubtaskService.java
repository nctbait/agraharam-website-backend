package org.agraharam.service;

import lombok.RequiredArgsConstructor;
import org.agraharam.dto.SubtaskDTO;
import org.agraharam.exception.NotFoundException;
import org.agraharam.model.Subtask;
import org.agraharam.model.Task;
import org.agraharam.model.User;
import org.agraharam.repository.SubtaskRepository;
import org.agraharam.repository.TaskRepository;
import org.agraharam.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubtaskService {
    @Autowired
    private  SubtaskRepository subtaskRepo;
    @Autowired private  TaskRepository taskRepo;
    @Autowired private  UserRepository userRepo;

    public List<SubtaskDTO> getByTask(Long taskId) {
        return subtaskRepo.findByParentTaskId(taskId).stream()
                .map(SubtaskDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public SubtaskDTO get(Long id) {
        return SubtaskDTO.fromEntity(
                subtaskRepo.findById(id).orElseThrow(() -> new NotFoundException("Subtask not found"))
        );
    }

    public void save(SubtaskDTO dto) {
        subtaskRepo.save(fromDto(dto));
    }

    public void update(Long id, SubtaskDTO dto) {
        Subtask subtask = subtaskRepo.findById(id).orElseThrow(() -> new NotFoundException("Subtask not found"));
        updateFromDto(subtask, dto);
        subtaskRepo.save(subtask);
    }

    public void delete(Long id) {
        subtaskRepo.deleteById(id);
    }

    private Subtask fromDto(SubtaskDTO dto) {
        Subtask subtask = new Subtask();
        updateFromDto(subtask, dto);
        return subtask;
    }

    private void updateFromDto(Subtask subtask, SubtaskDTO dto) {
        subtask.setName(dto.getName());
        subtask.setDescription(dto.getDescription());
        subtask.setStatus(dto.getStatus());
        subtask.setDeadline(dto.getDeadline());

        if (dto.getAssignedToId() != null) {
            User user = userRepo.findById(dto.getAssignedToId()).orElseThrow(() -> new NotFoundException("User not found"));
            subtask.setAssignedTo(user);
        } else {
            subtask.setAssignedTo(null);
        }

        if (dto.getParentTaskId() != null) {
            Task task = taskRepo.findById(dto.getParentTaskId()).orElseThrow(() -> new NotFoundException("Parent task not found"));
            subtask.setParentTask(task);
        }
    }
}
