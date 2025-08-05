package org.agraharam.repository;

import org.agraharam.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    // Optional: Custom queries
    List<AuditLog> findByActorEmail(String actorEmail);

    List<AuditLog> findByTargetTypeAndTargetIdOrderByTimestampDesc(String targetType, String targetId);

    List<AuditLog> findByBatchId(String batchId);

    @Query("SELECT a FROM AuditLog a WHERE a.action NOT IN :excluded ORDER BY a.timestamp DESC")
    List<AuditLog> findAllExcluding(@Param("excluded") List<String> excludedActions);

    Page<AuditLog> findByActionNotIn(List<String> excludedActions, Pageable pageable);

}
