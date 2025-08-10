package org.agraharam.repository;

import java.time.LocalDate;
import java.util.List;

import org.agraharam.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByDateAfter(LocalDate date);

    long countByDateGreaterThanEqual(LocalDate now);

}
