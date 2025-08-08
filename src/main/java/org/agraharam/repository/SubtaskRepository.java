package org.agraharam.repository;

import org.agraharam.model.Subtask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubtaskRepository extends JpaRepository<Subtask, Long> {

    List<Subtask> findByParentTaskId(Long taskId);

    List<Subtask> findByAssignedToId(Long userId);

    List<Subtask> findByStatus(String status);

    void deleteByParentTaskId(Long taskId);
}
