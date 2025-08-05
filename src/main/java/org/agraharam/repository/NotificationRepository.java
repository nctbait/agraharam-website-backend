package org.agraharam.repository;

import java.util.List;

import org.agraharam.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByTimestampDesc(Long userId);
    long countByUserIdAndNotificationReadFalse(Long userId);
}