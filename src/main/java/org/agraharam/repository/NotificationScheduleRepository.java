package org.agraharam.repository;

import java.util.List;

import org.agraharam.model.NotificationSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationScheduleRepository extends JpaRepository<NotificationSchedule, Long> {
    List<NotificationSchedule> findByActiveTrue();

    List<NotificationSchedule> findByTriggerTypeAndActiveTrue(String triggerType);
}
