package org.agraharam.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.agraharam.model.Family;

public interface FamilyRepository extends JpaRepository<Family, Long> {};