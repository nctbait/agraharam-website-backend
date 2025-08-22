package org.agraharam.service;

import java.io.IOException;
import java.io.InputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.agraharam.enums.AttachmentOwnerType;
import org.agraharam.model.Attachment;
import org.agraharam.model.User;
import org.agraharam.repository.AttachmentRepository;
import org.agraharam.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AttachmentService {
   @Autowired private  AttachmentRepository repo;
   @Autowired private  StorageService storage;
   @Autowired private  UserRepository users; // track uploader
   @Autowired private  AuditLogServiceImpl audit;   
  private  final Set<String> ALLOWED = Set.of(
    "application/pdf","image/jpeg","image/png","image/webp",
    "text/plain","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","image/heic","image/heif" 
  );

  private static final long MAX_BYTES = 15 * 1024 * 1024; // 15MB
public Attachment upload(AttachmentOwnerType ownerType, Long ownerId,
                           MultipartFile file, String uploadedByEmail) throws IOException {
    if (file.isEmpty()) throw new IllegalArgumentException("Empty file");
    if (file.getSize() > MAX_BYTES) throw new IllegalArgumentException("File too large");
    String ct = Optional.ofNullable(file.getContentType()).orElse("application/octet-stream");
    if (!ALLOWED.contains(ct)) throw new IllegalArgumentException("Unsupported type: " + ct);

    String sha = sha256Hex(file.getInputStream());
    String key = storage.save(safeName(file.getOriginalFilename()), ct, file.getInputStream(), file.getSize());
    Long uploaderId = users.findByEmail(uploadedByEmail).map(User::getId).orElse(null);

    Attachment a = Attachment.builder()
      .ownerType(ownerType)
      .ownerId(ownerId)
      .filename(file.getOriginalFilename())
      .contentType(ct)
      .size(file.getSize())
      .storageKey(key)
      .sha256(sha)
      .uploadedByUserId(uploaderId)
      .build();
    a = repo.save(a);

    audit.log("ATTACHMENT_UPLOAD", uploadedByEmail,"Attachment",String.valueOf(a.getId()),
      "id: "+ a.getId()+ ", ownerType:"+ownerType.name()+",ownerId:"+ ownerId+",filename:"+a.getFilename());
    return a;
  }

  public List<Attachment> list(AttachmentOwnerType t, Long id) {
    return repo.findAllByOwner(t, id);
  }

  public Attachment get(Long id) { return repo.findById(id).orElseThrow(); }

  public InputStream openStream(Long id) throws IOException {
    return storage.load(get(id).getStorageKey());
  }

  public void delete(Long id, String actorEmail) throws IOException {
    Attachment a = get(id);
    storage.delete(a.getStorageKey());
    repo.delete(a);
    audit.log("ATTACHMENT_DELETE", actorEmail,"Attachment",String.valueOf(id),
      "deleting upload by id: "+id);
     }

  private static String sha256Hex(InputStream in) throws IOException {
    try (in) {
      MessageDigest md = MessageDigest.getInstance("SHA-256");
      byte[] buf = new byte[8192]; int r;
      while ((r = in.read(buf)) != -1) md.update(buf, 0, r);
      return HexFormat.of().formatHex(md.digest());
    } catch (NoSuchAlgorithmException e) { throw new RuntimeException(e); }
  }

  private static String safeName(String fn) {
    String clean = fn == null ? "file" : fn.replaceAll("[^A-Za-z0-9._-]","_");
    return clean.length() > 60 ? clean.substring(clean.length()-60) : clean;
  }

}
