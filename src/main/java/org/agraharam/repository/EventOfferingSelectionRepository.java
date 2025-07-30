package org.agraharam.repository;

import java.util.List;

import org.agraharam.model.EventOfferingSelection;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventOfferingSelectionRepository extends JpaRepository<EventOfferingSelection, Long> {

    List<EventOfferingSelection> findByRegistrationId(Long registrationId);

    List<EventOfferingSelection> findByOfferingId(Long offeringId);
}