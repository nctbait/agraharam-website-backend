package org.agraharam.controller;

import java.security.InvalidKeyException;
import java.util.Optional;
import java.util.UUID;

import org.agraharam.dto.LoginMfaRequiredResponse;
import org.agraharam.dto.LoginRequest;
import org.agraharam.dto.LoginResponse;
import org.agraharam.dto.MfaVerifyRequest;
import org.agraharam.model.User;
import org.agraharam.repository.UserRepository;
import org.agraharam.security.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.github.benmanes.caffeine.cache.Cache;

import org.agraharam.service.AuditLogServiceImpl;
import org.agraharam.service.TotpService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api")
public class LoginController {
    @Autowired
    AuditLogServiceImpl auditLogService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private Cache<String, Long> mfaChallenges;
    @Autowired
    private TotpService totp;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {

        auditLogService.log("LOGIN_ATTEMPT", request.getEmail(), "User", "-", "Login Attempt Made ");

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!user.isApproved() || !user.isHasLogin()) {
            return ResponseEntity.status(403).body("User not approved or not allowed to login.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword().getHash())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        String email = user.getEmail(); // correct user identity
        if (Boolean.TRUE.equals(user.isTotpEnabled())) {
            String challengeId = UUID.randomUUID().toString();
            mfaChallenges.put(challengeId, user.getId());
            auditLogService.log("MFA_CHALLENGE_SENT", email, "User", String.valueOf(user.getId()),
                    "Login MFA R+Challenge Sent");
            return ResponseEntity.ok(new LoginMfaRequiredResponse(true, challengeId, 180));
        }
        String token = jwtTokenUtil.generateToken(user);

        auditLogService.log("LOGIN_SUCCESS", email, "User", String.valueOf(user.getId()), "Login Successful");
        return ResponseEntity.ok(new LoginResponse(token));
    }

    @PostMapping("/login/mfa-verify")
    public ResponseEntity<?> verifyMfa(@RequestBody MfaVerifyRequest req) throws InvalidKeyException {
        Long userId = mfaChallenges.getIfPresent(req.challengeId());
        if (userId == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Challenge expired");

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        if (!Boolean.TRUE.equals(user.isTotpEnabled()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);

        if (!totp.verify(userId, req.code()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid code");

        mfaChallenges.invalidate(req.challengeId());
        String token = jwtTokenUtil.generateToken(user);
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