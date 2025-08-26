package org.agraharam.controller;

import java.util.Map;

import org.agraharam.service.PasswordResetService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/public/auth")
@RequiredArgsConstructor
public class PasswordResetController {
  private final PasswordResetService svc;

  @PostMapping("/forgot-password")
  public Map<String,String> forgot(@RequestBody Map<String,String> body, HttpServletRequest req) {
    String email = body.getOrDefault("email", "");
    svc.requestReset(email, req);
    return Map.of("status","ok"); // always 200
  }

  @PostMapping("/reset-password")
  public Map<String,String> reset(@RequestBody Map<String,String> body) {
    String token = body.get("token");
    String pwd = body.get("newPassword");
    requireStrongPassword(pwd);
    svc.resetPassword(token, pwd);
    return Map.of("status","ok");
  }

  private static void requireStrongPassword(String p) {
    if (p == null || p.length() < 15) throw new IllegalArgumentException("Password too short");
    // add more checks if you want (uppercase/lowercase/digit/special)
  }
}
