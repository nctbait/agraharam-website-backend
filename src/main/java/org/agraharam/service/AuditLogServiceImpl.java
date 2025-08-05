package org.agraharam.service;

import java.time.LocalDateTime;
import java.util.List;

import org.agraharam.model.AuditLog;
import org.agraharam.repository.AuditLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogServiceImpl(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    public void log(String action, String actorEmail, String targetType, String targetId, String details) {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder
                .currentRequestAttributes()).getRequest();

        String ip = getClientIp(request);
        String userAgent = request.getHeader("User-Agent");

        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setActorEmail(actorEmail);
        log.setTargetType(targetType);
        log.setTargetId(targetId);
        log.setDetails(details);
        log.setIpAddress(ip);
        log.setUserAgent(userAgent);
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);
    }

    @Override
    public void logBatch(String action, String actorEmail, String targetType, String targetId, String details,
            String batchId) {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder
                .currentRequestAttributes()).getRequest();

        String ip = getClientIp(request);
        String userAgent = request.getHeader("User-Agent");

        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setActorEmail(actorEmail);
        log.setTargetType(targetType);
        log.setTargetId(targetId);
        log.setDetails(details);
        log.setIpAddress(ip);
        log.setUserAgent(userAgent);
        log.setTimestamp(LocalDateTime.now());
        log.setBatchId(batchId);
        auditLogRepository.save(log);
    }

    public String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        String ip = (xfHeader != null) ? xfHeader.split(",")[0] : request.getRemoteAddr();
        return "0:0:0:0:0:0:0:1".equals(ip) ? "127.0.0.1" : ip;
    }

    public List<AuditLog> getFilteredAuditLogs(List<String> exclude) {
        if (exclude == null || exclude.isEmpty()) {
            return auditLogRepository.findAll(Sort.by(Sort.Direction.DESC, "timestamp"));
        }
        return auditLogRepository.findAllExcluding(exclude);
    }

    public Page<AuditLog> getFilteredAuditLogs(List<String> exclude, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"));
        if (exclude == null || exclude.isEmpty()) {
            return auditLogRepository.findAll(pageable);
        }
        return auditLogRepository.findByActionNotIn(exclude, pageable);
    }

}
