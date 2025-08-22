package org.agraharam.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

// LocalStorageService.java
@Service 
public class LocalStorageService implements StorageService {
  @Value("${attachments.local.base:uploads}") Path base;

  @Override public String save(String keyHint, String ct, InputStream in, long size) throws IOException {
    Files.createDirectories(base);
    String key = deriveKey(keyHint);
    Path p = base.resolve(key);
    Files.createDirectories(p.getParent());
    Files.copy(in, p);
    return key;
  }

  @Override public InputStream load(String storageKey) throws IOException {
    return Files.newInputStream(base.resolve(storageKey));
  }

  @Override public void delete(String storageKey) throws IOException {
    Files.deleteIfExists(base.resolve(storageKey));
  }
}

