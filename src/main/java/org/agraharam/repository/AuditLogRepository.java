package org.agraharam.repository;

import org.agraharam.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    // Optional: Custom queries
    List<AuditLog> findByActorEmail(String actorEmail);

    List<AuditLog> findByTargetTypeAndTargetIdOrderByTimestampDesc(String targetType, String targetId);

    List<AuditLog> findByBatchId(String batchId);
}
