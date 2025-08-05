package org.agraharam.repository;

import java.util.List;
import java.util.Optional;

import org.agraharam.enums.Role;
import org.agraharam.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findByApprovedFalse();
    List<User> findByAccessRole(String accessRole);
    List<User> findByFamilyId(Long familyId);

    @Query("SELECT u FROM User u WHERE u.approved = false and u.accessRole = 'user' and u.hasLogin= true ")
    List<User> findPendingGeneralUsers();
    Optional<User> findByEmail(String email); 
    List<User> findByAccessRoleIn(List<String> roles);
    
    @Query("SELECT u FROM User u " +
       "WHERE u.accessRole = 'user' AND u.approved = true AND u.email IS NOT NULL AND u.hasLogin = true " +
       "AND (LOWER(u.firstName) LIKE %:query% OR LOWER(u.lastName) LIKE %:query% OR LOWER(u.email) LIKE %:query%)")
    List<User> findEligibleUsers(@Param("query") String query);

    @Query("SELECT u FROM User u WHERE " +
       "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
       "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
       "LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<User> searchByNameOrEmail(@Param("query") String query);

    Optional<User> findByFamilyIdAndRole(Long familyId, Role role);
}
