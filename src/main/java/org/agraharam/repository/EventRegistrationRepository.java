package org.agraharam.repository;

import java.util.List;

import org.agraharam.enums.EventStatus;
import org.agraharam.model.EventRegistration;
import org.agraharam.model.Family;
import org.agraharam.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    List<EventRegistration> findByUser(User user);
    List<EventRegistration> findByUser_Family(Family family);
    @Query("SELECT u FROM User u JOIN EventRegistration r ON u.id = r.user.id WHERE r.event.id = :eventId AND r.status = 'CONFIRMED'")
    List<User> findRegisteredUsers(Long eventId);
    List<EventRegistration> findByUser_FamilyAndStatus(Family family, EventStatus status);
}

