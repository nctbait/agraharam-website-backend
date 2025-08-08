package org.agraharam.repository;

import java.util.List;

import org.agraharam.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task>  {

    // Optional: filter by event
    List<Task> findByEventId(Long eventId);

    // Optional: filter by assigned user
    List<Task> findByAssignedToId(Long userId);

    // Optional: filter by status
    List<Task> findByStatus(String status);

    // Combine filters if needed
    List<Task> findByAssignedToIdAndStatus(Long userId, String status);
}