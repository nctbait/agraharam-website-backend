package org.agraharam.service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import org.agraharam.dto.ContactMessageRequest;
import org.agraharam.model.ContactMessage;
import org.agraharam.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
public class ContactService {
  @Autowired private ContactMessageRepository repo;
  @Autowired private JavaMailSender mailSender;
  @Value("${app.contact.from:noreply@agraharamnc.org}") String from;

  private static final Map<String,String> ROUTING = Map.ofEntries(
    Map.entry("food", "food@agraharamnc.org"),
    Map.entry("events", "events@agraharamnc.org"),
    Map.entry("youth", "youth-services@agraharamnc.org"),
    Map.entry("matrimony", "cultural-kalyanam@agraharamnc.org"),
    Map.entry("finance", "treasury-membership@agraharamnc.org"),
    Map.entry("religious", "religious@agraharamnc.org"),
    Map.entry("it", "it@agraharamnc.org"),
    Map.entry("president", "president@agraharamnc.org"),
    Map.entry("trustees", "chairmanoffice@agraharamnc.org"),
    Map.entry("general", "bods@agraharamnc.org")
  );

  public void submit(ContactMessageRequest req, String ip, String ua) {
    // basic server-side validation
    if (req.name() == null || req.name().isBlank()) throw new IllegalArgumentException("Name required");
    if (req.email() == null || !req.email().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) throw new IllegalArgumentException("Valid email required");
    if (req.committee() == null || !ROUTING.containsKey(req.committee())) throw new IllegalArgumentException("Invalid committee");
    if (req.message() == null || req.message().isBlank() || req.message().length() > 4000) throw new IllegalArgumentException("Message invalid");

    ContactMessage cm = new ContactMessage();
    cm.setName(req.name().trim());
    cm.setEmail(req.email().trim());
    cm.setPhone(req.phone());
    cm.setCommittee(req.committee());
    cm.setMessage(req.message().trim());
    cm.setIp(ip);
    cm.setUserAgent(ua != null ? ua.substring(0, Math.min(ua.length(), 255)) : "");
    repo.save(cm);

    // send email
    String to = ROUTING.get(req.committee());
    SimpleMailMessage msg = new SimpleMailMessage();
    msg.setFrom(from);
    msg.setTo(to);
    msg.setReplyTo(req.email());
    msg.setSubject("[NCTBA Contact] " + req.committee().toUpperCase() + " - " + req.name());
    msg.setText("""
      Name: %s
      Email: %s
      Phone: %s
      Committee: %s
      Submitted: %s

      Message:
      %s
      """.formatted(req.name(), req.email(), Optional.ofNullable(req.phone()).orElse("-"),
                     req.committee(), LocalDateTime.now(), req.message()));
    mailSender.send(msg);
  }
}

