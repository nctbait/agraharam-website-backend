package org.agraharam.controller;

import java.util.List;

import org.agraharam.dto.SubtaskDTO;
import org.agraharam.service.SubtaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/subtasks")
public class SubtaskController {
     
    @Autowired
    private  SubtaskService subtaskService;

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<SubtaskDTO>> getByTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(subtaskService.getByTask(taskId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubtaskDTO> getSubtask(@PathVariable Long id) {
        return ResponseEntity.ok(subtaskService.get(id));
    }

    @PostMapping
    public ResponseEntity<?> createSubtask(@RequestBody SubtaskDTO dto) {
        subtaskService.save(dto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSubtask(@PathVariable Long id, @RequestBody SubtaskDTO dto) {
        subtaskService.update(id, dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubtask(@PathVariable Long id) {
        subtaskService.delete(id);
        return ResponseEntity.ok().build();
    }
}
