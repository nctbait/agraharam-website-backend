package org.agraharam.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.agraharam.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    long countByStatusIn(List<String> of);

    long countByStatusInAndDeadlineBefore(List<String> of, LocalDate now);

    @Query("""
        select t from Task t
        where lower(t.status) = 'completed'
          and t.createdAt between :start and :end
    """)
    List<Task> findCompletedBetween(@Param("start") LocalDateTime start,
                                    @Param("end") LocalDateTime end);

    @Query("select t.status, count(t) from Task t group by t.status")
    List<Object[]> countGroupByStatus();
}