package org.agraharam.repository;

import org.agraharam.enums.VendorPaymentStatus;
import org.agraharam.model.VendorPayment;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VendorPaymentRepository
                extends JpaRepository<VendorPayment, Long>, JpaSpecificationExecutor<VendorPayment> {

        Page<VendorPayment> findByStatus(VendorPaymentStatus status, Pageable pageable);

        List<VendorPayment> findByVendorIdOrderByCreatedAtDesc(Long vendorId);

        @Query("select vp from VendorPayment vp where vp.status in :statuses")
        Page<VendorPayment> findByStatusIn(@Param("statuses") List<VendorPaymentStatus> statuses, Pageable pageable);

        @Query("select vp from VendorPayment vp where vp.vendor.id = :vendorId and vp.status = :status")
        Page<VendorPayment> findByVendorAndStatus(@Param("vendorId") Long vendorId,
                        @Param("status") VendorPaymentStatus status,
                        Pageable pageable);

        @Lock(LockModeType.PESSIMISTIC_WRITE)
        @Query("select vp from VendorPayment vp where vp.id = :id")
        Optional<VendorPayment> getForUpdate(@Param("id") Long id);

        Page<VendorPayment> findByEventId(Long eventId, Pageable pageable);

        @Query("select vp from VendorPayment vp where vp.event.id = :eventId and vp.status = :status")
        Page<VendorPayment> findByEventAndStatus(@Param("eventId") Long eventId,
                        @Param("status") VendorPaymentStatus status,
                        Pageable pageable);

        @Query("""
                          select vp from VendorPayment vp
                          where (:eventId is null or vp.event.id = :eventId)
                            and (:vendorId is null or vp.vendor.id = :vendorId)
                            and (:status is null or vp.status = :status)
                          order by vp.createdAt desc
                        """)
        Page<VendorPayment> search(@Param("eventId") Long eventId,
                        @Param("vendorId") Long vendorId,
                        @Param("status") VendorPaymentStatus status,
                        Pageable pageable);

        @Query("""
                            SELECT vp
                            FROM VendorPayment vp
                            WHERE vp.status = org.agraharam.enums.VendorPaymentStatus.APPROVED
                              AND vp.createdAt BETWEEN :from AND :to
                        """)
        List<VendorPayment> findApprovedBetween(@Param("from") OffsetDateTime fromOffset,
                        @Param("to") OffsetDateTime toOffset);

}