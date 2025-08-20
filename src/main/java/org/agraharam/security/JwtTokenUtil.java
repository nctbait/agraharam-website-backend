package org.agraharam.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

import java.util.Date;

import javax.crypto.SecretKey;

import org.agraharam.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    private SecretKey secretKey;
    @Value("${jwt.expirtyMs}")
    private long expirationMs; // 1 day

    @PostConstruct
    public void init() {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String generateToken(User user) {
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("accessRole", user.getAccessRole().toString())
                .claim("userId", user.getId())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(secretKey)
                .compact();
    }

    public String generateAccessToken(User user) {
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("accessRole", user.getAccessRole().toString())
                .claim("userId", user.getId())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(secretKey)
                .compact();
    }

    // ✅ Refresh Token (only subject, no claims)
    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(secretKey)
                .compact();
    }
}



