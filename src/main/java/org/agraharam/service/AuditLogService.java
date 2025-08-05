package org.agraharam.service;

import java.util.List;

import org.agraharam.model.AuditLog;
import org.springframework.data.domain.Page;

public interface AuditLogService {
    void log(String action, String actorEmail, String targetType, String targetId, String message);
    public void logBatch(String action, String actorEmail, String targetType, String targetId, String details,String batchId);
    public List<AuditLog> getFilteredAuditLogs(List<String> exclude);
    public Page<AuditLog> getFilteredAuditLogs(List<String> exclude, int page, int size);
}
