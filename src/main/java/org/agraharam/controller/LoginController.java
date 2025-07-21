package org.agraharam.controller;

import java.util.Optional;

import org.agraharam.dto.LoginRequest;
import org.agraharam.dto.LoginResponse;
import org.agraharam.model.User;
import org.agraharam.repository.UserRepository;
import org.agraharam.security.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.agraharam.service.AuditLogServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;


@RestController
@RequestMapping("/api")
public class LoginController {
    @Autowired AuditLogServiceImpl auditLogService;
    @Autowired private UserRepository userRepository;
    @Autowired private JwtTokenUtil jwtTokenUtil;

    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request,  HttpServletRequest httpRequest) {
        
        auditLogService.log("LOGIN_ATTEMPT", request.getEmail(), "User", "-", "Login Attempt Made ");
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!user.isApproved() || !user.isHasLogin()) {
            return ResponseEntity.status(403).body("User not approved or not allowed to login.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword().getHash())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        System.out.println("user access role: "+ user.getAccessRole());

        String token = jwtTokenUtil.generateToken(user);
        String email = user.getEmail(); // correct user identity

        auditLogService.log("LOGIN_SUCCESS", email, "User", "-", "Login Successful");

        return ResponseEntity.ok(new LoginResponse(token));
    }

    @PostMapping("/logout")
public ResponseEntity<?> logout(HttpServletRequest request) {
    String email = Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
        .map(Authentication::getName).orElse("UNKNOWN");

    auditLogService.log("LOGOUT", email, "User", "-", "User logged out");
    return ResponseEntity.ok("Logout recorded");
}

public String getClientIp(HttpServletRequest request) {
    String xfHeader = request.getHeader("X-Forwarded-For");
    String ip = (xfHeader != null) ? xfHeader.split(",")[0] : request.getRemoteAddr();
    return "0:0:0:0:0:0:0:1".equals(ip) ? "127.0.0.1" : ip;
}

}