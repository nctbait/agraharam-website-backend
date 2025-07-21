package org.agraharam.repository;

import org.springframework.data.jpa.repository.JpaRepository; 
import org.agraharam.model.Password;

public interface PasswordRepository extends JpaRepository<Password, Long> {}
