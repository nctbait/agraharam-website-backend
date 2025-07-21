package org.agraharam.audit;

import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.agraharam.service.AuditLogService;

import java.util.Arrays;
import java.util.Optional;

@Aspect
@Component
public class AdminAuditAspect {

    private final AuditLogService auditLogService;

    public AdminAuditAspect(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @After("@annotation(auditable)")
    public void auditAdminOps(JoinPoint joinPoint, Auditable auditable) {
        String actor = Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
        .map(Authentication::getName)
        .orElse("UNKNOWN");

        Object[] args = joinPoint.getArgs();
    String targetId = args.length > 0 ? String.valueOf(args[0]) : "-";
    String details = Arrays.toString(args);

    auditLogService.log(
        auditable.action(),
        actor,
        auditable.target(),
        targetId,
        details
    );
    }
}
