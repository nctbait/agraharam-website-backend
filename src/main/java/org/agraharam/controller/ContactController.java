package org.agraharam.controller;

import java.util.Map;

import org.agraharam.dto.ContactMessageRequest;
import org.agraharam.service.ContactService;
import org.agraharam.service.RecaptchaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/public")
public class ContactController {
  private final ContactService contactService;
  private final RecaptchaService recaptcha;

  public ContactController(ContactService contactService, RecaptchaService recaptcha) {
    this.contactService = contactService;
    this.recaptcha = recaptcha;
  }

  @PostMapping("/contact")
  public ResponseEntity<?> submit(@RequestBody ContactMessageRequest req,
                                  HttpServletRequest http) {
    if (req.captchaToken() == null || req.captchaToken().isBlank() || !recaptcha.verify(req.captchaToken())) {
      return ResponseEntity.badRequest().body(Map.of("message", "CAPTCHA validation failed"));
    }

    String ip = clientIp(http);
    String ua = http.getHeader("User-Agent");
    contactService.submit(req, ip, ua);
    return ResponseEntity.ok(Map.of("status", "ok"));
  }

  private String clientIp(HttpServletRequest http) {
    String xf = http.getHeader("X-Forwarded-For");
    if (xf != null && !xf.isBlank()) return xf.split(",",2)[0].trim();
    return http.getRemoteAddr();
  }
}

