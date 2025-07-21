package org.agraharam.repository;

import java.util.List;
import java.util.Optional;

import org.agraharam.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findByApprovedFalse();
    List<User> findByAccessRole(String accessRole);
    List<User> findByFamilyId(Long familyId);

    @Query("SELECT u FROM User u WHERE u.approved = false and u.accessRole = 'user' and u.hasLogin= true ")
    List<User> findPendingGeneralUsers();
    Optional<User> findByEmail(String email); 
}
