package org.agraharam.repository;

import java.util.List;

import org.agraharam.model.VolunteerCommittee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VolunteerCommitteeRepository extends JpaRepository<VolunteerCommittee, Long> {
    
    List<VolunteerCommittee> findByActiveTrueOrderByNameAsc();
}
