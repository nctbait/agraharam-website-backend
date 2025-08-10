package org.agraharam.repository;

import org.agraharam.model.Vendor;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long>, JpaSpecificationExecutor<Vendor> {

    List<Vendor> findByNameContainingIgnoreCase(String namePart);

    Optional<Vendor> findByEmailIgnoreCase(String email);
}