package org.agraharam.controller;

import java.security.Principal;
import java.util.List;

import org.agraharam.dto.UserDTO;
import org.agraharam.model.User;
import org.agraharam.pojo.RoleUpdateRequest;
import org.agraharam.repository.UserRepository;
import org.agraharam.service.AuditLogServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;


@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasAuthority('superAdmin')") // Only superAdmins can manage roles
public class AdminUserRoleController {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private  AuditLogServiceImpl auditLogService;

    @GetMapping("/admins")
    public ResponseEntity<List<UserDTO>> getAdminsAndSuperAdmins() {
        List<User> users = userRepository.findByAccessRoleIn(List.of("admin", "superAdmin"));
        return ResponseEntity.ok(users.stream().map(UserDTO::fromEntity).toList());
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUsers(@RequestParam String query) {
        List<User> users = userRepository.findEligibleUsers(query.toLowerCase());
        return ResponseEntity.ok(users.stream().map(UserDTO::fromEntity).toList());
    }

    @PostMapping("/{id}/role")
    public ResponseEntity<String> setRole(@PathVariable Long id, @RequestBody RoleUpdateRequest request, Principal principal) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
            String currentRole = user.getAccessRole().name();
        user.setAccessRole(request.getRole());
        userRepository.save(user);
        
        auditLogService.log("USER_ROLE_CHANGE", principal.getName(), 
        "User", String.valueOf(id), 
        "Changeing user access role for user :"+user.getFirstName()+" "+user.getLastName() +" from "+ currentRole + " to role "+request.getRole().name());

        return ResponseEntity.ok("Role updated successfully");
    }
}

