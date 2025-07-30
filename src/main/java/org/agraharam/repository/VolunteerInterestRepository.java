package org.agraharam.repository;

import java.util.List;

import org.agraharam.model.VolunteerInterest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface VolunteerInterestRepository extends JpaRepository<VolunteerInterest, Long> {

    List<VolunteerInterest> findByFamilyMemberId(Long familyMemberId);

    List<VolunteerInterest> findByEventId(Long eventId);

    List<VolunteerInterest> findByUserId(Long userId);

    @Query("SELECT vi FROM VolunteerInterest vi WHERE vi.committee.id = :committeeId")
    List<VolunteerInterest> findByCommitteeId(Long committeeId);

    List<VolunteerInterest> findByFamilyId(Long familyId);

    void deleteByFamilyId(Long familyId);

}
