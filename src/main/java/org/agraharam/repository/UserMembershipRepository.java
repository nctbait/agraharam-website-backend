package org.agraharam.repository;

import java.util.List;
import java.util.Optional;

import org.agraharam.model.UserMembership;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserMembershipRepository extends JpaRepository<UserMembership, Long> {
    List<UserMembership> findByUserIdAndStatus(Long userId, String status);
    Optional<UserMembership> findTopByUserIdAndStatusOrderByStartDateDesc(Long userId, String status);

}

