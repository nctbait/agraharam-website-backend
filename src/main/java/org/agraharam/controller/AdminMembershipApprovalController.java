package org.agraharam.controller;

import java.util.List;
import java.security.Principal;

import org.agraharam.dto.IdListRequest;
import org.agraharam.dto.UserMembershipDTO;
import org.agraharam.service.AuditLogServiceImpl;
import org.agraharam.service.UserMembershipServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/admin/memberships")
@PreAuthorize("hasAuthority('superAdmin')")
public class AdminMembershipApprovalController {

    @Autowired
    private  UserMembershipServiceImpl membershipService;
    @Autowired
    private  AuditLogServiceImpl auditLogService;

    @GetMapping("/pending")
    public List<UserMembershipDTO> getPendingRequests() {
        return membershipService.getPendingRequests();
    }

    @PostMapping("/approve")
    public ResponseEntity<?> approveMemberships(@RequestBody IdListRequest request, Principal principal) {
        membershipService.approveMemberships(request.getIds());
        request.getIds().forEach(id ->
            auditLogService.log("APPROVE_MEMBERSHIP_UPGRADE", principal.getName(), "UserMembership", String.valueOf(id), "Approved membership request, membership id:"+id));
        return ResponseEntity.ok("Approved");
    }

    @PostMapping("/reject")
    public ResponseEntity<?> rejectMemberships(@RequestBody IdListRequest request, Principal principal) {
        membershipService.rejectMemberships(request.getIds());
        request.getIds().forEach(id ->
            auditLogService.log("REJECT_MEMBERSHIP", principal.getName(), "UserMembership", String.valueOf(id), "Rejected membership request, membership id:"+id));
        return ResponseEntity.ok("Rejected");
    }
}

