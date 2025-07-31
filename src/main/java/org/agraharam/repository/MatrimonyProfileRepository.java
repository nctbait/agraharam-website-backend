package org.agraharam.repository;

import org.agraharam.model.MatrimonyProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MatrimonyProfileRepository extends JpaRepository<MatrimonyProfile, Long> {

    List<MatrimonyProfile> findByStatus(String status);

    List<MatrimonyProfile> findByStatusIn(List<String> statuses);

    List<MatrimonyProfile> findByFamilyId(Long familyId);

    // Optional: for searching based on name/gender/location, etc.
    List<MatrimonyProfile> findByStatusAndNameContainingIgnoreCase(String status, String name);

    // Add more query methods as needed for filters/search in the UI
}

