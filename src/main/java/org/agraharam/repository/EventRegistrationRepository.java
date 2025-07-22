package org.agraharam.repository;

import java.util.List;

import org.agraharam.model.EventRegistration;
import org.agraharam.model.Family;
import org.agraharam.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    List<EventRegistration> findByUser(User user);
    List<EventRegistration> findByUser_Family(Family family);

}

