package org.agraharam.config;

import java.time.Duration;

import org.agraharam.service.CryptoService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

@Configuration
class MfaConfig {
  @Bean
  Cache<String, Long> mfaChallenges() {
    return Caffeine.newBuilder()
        .expireAfterWrite(Duration.ofMinutes(3))
        .maximumSize(10000)
        .build();
  }

  @Bean
  public CryptoService cryptoService(@Value("${mfa.aes-key}") String base64Key) {
    return new CryptoService(base64Key);
  }
}
