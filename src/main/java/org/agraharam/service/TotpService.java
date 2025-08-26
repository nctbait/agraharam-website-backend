package org.agraharam.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;

import javax.crypto.spec.SecretKeySpec;

import org.agraharam.repository.UserRepository;
import org.apache.commons.codec.binary.Base32;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TotpService {
  @Autowired private  UserRepository users;
  @Autowired private  CryptoService crypto;

  // Start setup: generate secret & otpauth URI
  public Map<String,String> beginSetup(Long userId, String issuer, String email) {
    byte[] secret = new byte[20]; new SecureRandom().nextBytes(secret); // 160-bit
    String base32 = new Base32().encodeToString(secret).replace("=", "");
    String uri = "otpauth://totp/%s:%s?secret=%s&issuer=%s&digits=6&period=30&algorithm=SHA1"
      .formatted(url(issuer), url(email), base32, url(issuer));
    // Do NOT persist yet; persist only after user verifies a code.
    return Map.of("secret", base32, "otpauthUri", uri);
  }

  // Enable after user enters the code from their app
  public void enable(Long userId, String base32Secret, String code) throws InvalidKeyException {
    byte[] secret = new Base32().decode(base32Secret);
    if (!verifyNow(secret, code)) throw new IllegalArgumentException("Invalid code");
    var enc = crypto.encrypt(secret);
    users.updateTotp(userId, true, enc);
  }

  public void disable(Long userId, String currentCodeOrPassword) {
    // optionally require TOTP code or password confirmation
    users.updateTotp(userId, false, null);
  }

  public boolean verify(Long userId, String code) throws InvalidKeyException {
    var user = users.findById(userId).orElseThrow();
    if (!Boolean.TRUE.equals(user.isTotpEnabled())) return true; // not required
    byte[] secret = crypto.decryptToBytes(user.getTotpSecret());
    return verifyNow(secret, code);
  }

  private boolean verifyNow(byte[] secret, String code) throws InvalidKeyException {
    var totp = new com.eatthepath.otp.TimeBasedOneTimePasswordGenerator(); // 30s, 6 digits
    var macKey = new SecretKeySpec(secret, "HmacSHA1");
    Instant now = Instant.now();
    // allow small window ±1 step
    for (int w = -1; w <= 1; w++) {
      Instant t = now.plus(Duration.ofSeconds(30L * w));
      String expected = String.format("%06d", totp.generateOneTimePassword(macKey, t));
      if (MessageDigest.isEqual(expected.getBytes(StandardCharsets.UTF_8), code.getBytes(StandardCharsets.UTF_8)))
        return true;
    }
    return false;
  }

  private static String url(String s) {
    return URLEncoder.encode(s, StandardCharsets.UTF_8);
  }
}

