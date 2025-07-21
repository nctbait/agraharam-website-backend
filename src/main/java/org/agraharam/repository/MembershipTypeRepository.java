package org.agraharam.repository;

import java.util.List;

import org.agraharam.model.MembershipType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MembershipTypeRepository extends JpaRepository<MembershipType, Long> {
    List<MembershipType> findByIsActiveTrueOrderByPriceAsc();
}
