package org.agraharam.repository;

import java.util.List;

import org.agraharam.model.ContactMessageNote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactMessageNoteRepository extends JpaRepository<ContactMessageNote, Long> {
    List<ContactMessageNote> findByContactMessageIdOrderByCreatedAtAsc(Long messageId);
  }
  