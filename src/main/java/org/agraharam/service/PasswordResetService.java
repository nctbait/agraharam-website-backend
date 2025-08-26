package org.agraharam.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.sql.Timestamp;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.HexFormat;

import org.agraharam.model.PasswordResetToken;
import org.agraharam.repository.PasswordRepository;
import org.agraharam.repository.PasswordResetTokenRepository;
import org.agraharam.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

@Service
public class PasswordResetService {
    @Autowired
    private UserRepository users;
    @Autowired
    private PasswordRepository passwords;
    @Autowired
    private PasswordResetTokenRepository tokens;
    @Autowired
    private JavaMailSender mailer;
    private PasswordEncoder encoder = new BCryptPasswordEncoder();

    public void requestReset(String email, HttpServletRequest req) {
        var user = users.findByEmail(email).orElse(null);
        if (user != null) {
            String raw = generateToken();
            String hash = sha256(raw);
            tokens.save(PasswordResetToken.builder()
                    .userId(user.getId())
                    .tokenHash(hash)
                    .expiresAt(OffsetDateTime.now().plusHours(2))
                    .requestIp(getClientIp(req))
                    .requestUserAgent(req.getHeader("User-Agent"))
                    .build());
            String link = buildResetLink(raw, req);
            sendEmail(user.getEmail(), link);
        }
    }

    private String buildResetLink(String rawToken, HttpServletRequest req) {
        // Respect reverse proxy headers
        return UriComponentsBuilder.fromUriString(baseUrlFromRequest(req))
                .path("/reset-password")
                .queryParam("token", rawToken)
                .build()
                .toUriString();
    }
    
    @Transactional
    public void resetPassword(String rawToken, String newPassword) {
        String hash = sha256(rawToken);
        var token = tokens.findValidByHash(hash, OffsetDateTime.now()).orElse(null);
        if(token==null){
            throw new IllegalArgumentException("Invalid or expired token");
        }
        var user = users.findById(token.getUserId()).orElseThrow();
    
        // update password hash
        String newHash = encoder.encode(newPassword);
        passwords.saveOrUpdate(user.getId(), newHash, new Timestamp(System.currentTimeMillis()));
    
        // invalidate token + (optional) wipe all outstanding reset tokens for this user
        token.setUsedAt(OffsetDateTime.now());
        tokens.save(token);
        tokens.invalidateAllForUserExcept(user.getId(), token.getId(),OffsetDateTime.now());
      }

    private String baseUrlFromRequest(HttpServletRequest req) {
        String proto = headerOr(req, "X-Forwarded-Proto", req.getScheme());
        String host = headerOr(req, "X-Forwarded-Host", req.getServerName());
        String portH = req.getHeader("X-Forwarded-Port");
        int port = (portH != null) ? Integer.parseInt(portH) : req.getServerPort();
        boolean defaultPort = ("http".equalsIgnoreCase(proto) && port == 80)
                || ("https".equalsIgnoreCase(proto) && port == 443) || ("http".equalsIgnoreCase(proto) && port == 3000) 
                || ("https".equalsIgnoreCase(proto) && port == 3000);
        return proto + "://" + host + (defaultPort ? "" : ":" + port);
    }

    private static String headerOr(HttpServletRequest r, String h, String d) {
        String v = r.getHeader(h);
        return (v == null || v.isBlank()) ? d : v;
    }

    private static String generateToken() {
        byte[] buf = new byte[32];
        new SecureRandom().nextBytes(buf);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(buf);
    }

    private static String sha256(String s) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(md.digest(s.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    private void sendEmail(String to, String link) {
        var mail = new SimpleMailMessage();
        mail.setTo(to);
        mail.setSubject("Reset your Agraharam password");
        mail.setText("""
                  You requested a password reset.

                  Click this link (valid for 2 hours, one-time use):
                  %s

                  If you didn't request this, you can ignore the email.
                """.formatted(link));
        mailer.send(mail);
    }

    public String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        String ip = (xfHeader != null) ? xfHeader.split(",")[0] : request.getRemoteAddr();
        return "0:0:0:0:0:0:0:1".equals(ip) ? "127.0.0.1" : ip;
    }
}
