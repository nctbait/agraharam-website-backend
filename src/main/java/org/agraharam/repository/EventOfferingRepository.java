package org.agraharam.repository;

import org.agraharam.model.EventOffering;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventOfferingRepository extends JpaRepository<EventOffering, Long> {
    // Additional custom queries can go here if needed in the future
}
