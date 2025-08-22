package org.agraharam.service;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.UUID;

// StorageService.java
public interface StorageService {
    String save(String keyHint, String contentType, InputStream in, long size) throws IOException;
    InputStream load(String storageKey) throws IOException;
    void delete(String storageKey) throws IOException;
    default String deriveKey(String keyHint) {
      return "%s/%s".formatted(
        LocalDate.now(),
        UUID.randomUUID() + (keyHint != null ? "-" + keyHint : "")
      );
    }
  }
  
