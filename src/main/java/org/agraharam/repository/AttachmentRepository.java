package org.agraharam.repository;

import org.agraharam.enums.AttachmentOwnerType;
import org.agraharam.model.Attachment;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long>, JpaSpecificationExecutor<Attachment> {

    @Query("select a from Attachment a where a.ownerType = :ownerType and a.ownerId = :ownerId order by a.createdAt desc")
    List<Attachment> findAllByOwner(@Param("ownerType") AttachmentOwnerType ownerType,
                                    @Param("ownerId") Long ownerId);

    Page<Attachment> findByOwnerTypeAndOwnerId(AttachmentOwnerType ownerType, Long ownerId, Pageable pageable);
}