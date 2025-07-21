package org.agraharam.service;

public interface AuditLogService {
    void log(String action, String actorEmail, String targetType, String targetId, String message);
}
