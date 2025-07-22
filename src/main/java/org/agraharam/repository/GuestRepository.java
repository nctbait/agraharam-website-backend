package org.agraharam.repository;

import org.agraharam.model.EventRegistration;
import org.agraharam.model.Guest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestRepository extends JpaRepository<Guest, Long> {
    void deleteAllByRegistration(EventRegistration registration);
}
