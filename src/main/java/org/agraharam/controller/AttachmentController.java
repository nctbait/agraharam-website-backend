package org.agraharam.controller;

import java.io.IOException;
import java.io.InputStream;
import java.security.Principal;
import java.util.List;
import java.util.Optional;

import org.agraharam.enums.AttachmentOwnerType;
import org.agraharam.model.Attachment;
import org.agraharam.service.AttachmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/attachments")
public class AttachmentController {

    @Autowired
    private AttachmentService svc;

    @PostMapping(path = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Attachment upload(@RequestParam AttachmentOwnerType ownerType,
            @RequestParam Long ownerId,
            @RequestPart("file") MultipartFile file,
            Principal principal) throws IOException {
        assertCanAccess(principal, ownerType, ownerId, "upload");
        return svc.upload(ownerType, ownerId, file, principal.getName());
    }

    // AttachmentController.java
    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> download(
            @PathVariable Long id,
            @RequestParam(name = "download", defaultValue = "false") boolean download) throws IOException {
        Attachment a = svc.get(id);
        InputStream in = svc.openStream(id);

        String ct = Optional.ofNullable(a.getContentType()).orElse("application/octet-stream");
        String disposition = (download ? "attachment" : "inline") + "; filename=\"" + a.getFilename() + "\"";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition)
                .contentType(MediaType.parseMediaType(ct))
                .body(new InputStreamResource(in));
    }

    @GetMapping
    public List<Attachment> list(@RequestParam AttachmentOwnerType ownerType,
            @RequestParam Long ownerId,
            Principal principal) {
        assertCanAccess(principal, ownerType, ownerId, "list");
        return svc.list(ownerType, ownerId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InputStreamResource> download(@PathVariable Long id) throws IOException {
        Attachment a = svc.get(id);
        InputStream in = svc.openStream(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + a.getFilename() + "\"")
                .contentType(MediaType.parseMediaType(
                        Optional.ofNullable(a.getContentType()).orElse("application/octet-stream")))
                .body(new InputStreamResource(in));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, Principal principal) throws IOException {
        Attachment a = svc.get(id);
        assertCanAccess(principal, a.getOwnerType(), a.getOwnerId(), "delete");
        svc.delete(id, principal.getName());
    }

    private void assertCanAccess(Principal p, AttachmentOwnerType t, Long id, String action) {
        // TODO: implement authorization:
        // e.g., admin/superAdmin OR owner of the Bill/Vendor/Contact record.
    }
}
