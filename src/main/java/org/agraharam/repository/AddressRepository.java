package org.agraharam.repository;

import org.springframework.data.jpa.repository.JpaRepository; 
import org.agraharam.model.Address;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
    Optional<Address> findByFamilyId(Long familyId);    
}