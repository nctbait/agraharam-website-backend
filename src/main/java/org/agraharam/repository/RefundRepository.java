package org.agraharam.repository;

import jakarta.persistence.LockModeType;

import org.agraharam.enums.RefundReferenceType;
import org.agraharam.enums.RefundStatus;
import org.agraharam.model.Refund;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface RefundRepository extends JpaRepository<Refund, Long>, JpaSpecificationExecutor<Refund> {

    Page<Refund> findByStatus(RefundStatus status, Pageable pageable);

    @Query("select r from Refund r " +
           "where r.referenceType = :refType and r.referenceId = :refId " +
           "order by r.createdAt desc")
    List<Refund> findByReference(@Param("refType") RefundReferenceType refType,
                                 @Param("refId") Long refId);

    @Query("select r from Refund r " +
           "where r.status in :statuses " +
           "order by r.createdAt desc")
    Page<Refund> findByStatusIn(@Param("statuses") List<RefundStatus> statuses, Pageable pageable);

    @Query("select coalesce(sum(r.amountApproved), 0) from Refund r " +
           "where r.referenceType = :refType and r.referenceId = :refId and r.status = 'PROCESSED'")
    BigDecimal sumProcessedFor(@Param("refType") RefundReferenceType refType,
                               @Param("refId") Long refId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select r from Refund r where r.id = :id")
    Optional<Refund> getForUpdate(@Param("id") Long id);
}
