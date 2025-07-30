package org.agraharam.repository;

import java.util.List;

import org.agraharam.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByMemberIdIn(List<Long> memberIds);
    List<Bill> findByStatus(String status);

}
