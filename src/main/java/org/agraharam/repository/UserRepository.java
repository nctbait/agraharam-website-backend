package org.agraharam.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.agraharam.enums.Role;
import org.agraharam.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;

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
    long countByApprovedFalseAndHasLoginTrue();
    long countByRoleAndApprovedTrue(Role primary);

    @Query("""
        select u from User u
        where lower(u.role) = 'primary'
          and u.approved = true
    """)
    List<User> findActiveMembers();

    @Query("""
        select u from User u
        where u.createdAt between :start and :end
          and lower(u.role) = 'primary'
    """)
    List<User> findNewMembersBetween(@Param("start") LocalDateTime start,
                                     @Param("end") LocalDateTime end);

                                     @Modifying(clearAutomatically = true, flushAutomatically = true)
  @Transactional
  @Query("update User u set u.totpEnabled = :enabled, u.totpSecret = :secret where u.id = :userId")
  int updateTotp(@Param("userId") Long userId,
                 @Param("enabled") boolean enabled,
                 @Param("secret") String secret);
}
