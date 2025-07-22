package org.agraharam.repository;

import org.agraharam.model.FamilyMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FamilyMemberRepository extends JpaRepository<FamilyMember, Long> {
    
    // Fetch all family members for a given family ID
    List<FamilyMember> findByFamilyId(Long familyId);
}
