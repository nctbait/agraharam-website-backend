package org.agraharam.controller;

import org.agraharam.repository.FamilyRepository;
import org.agraharam.repository.UserRepository;
import org.agraharam.service.AuditLogServiceImpl;
import org.agraharam.service.EmailService;
import org.agraharam.repository.PasswordRepository;
import org.agraharam.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.agraharam.model.Family;
import org.agraharam.model.Address;
import org.agraharam.model.Password;
import org.agraharam.model.User;
import org.agraharam.dto.UserRegistrationRequest;
import org.agraharam.enums.Vedam;
import org.agraharam.exception.FieldValidationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@RestController
@RequestMapping("/api")
public class RegistrationController {
  @Autowired FamilyRepository familyRepo;
  @Autowired UserRepository userRepo;
  @Autowired AddressRepository addressRepo;
  @Autowired PasswordRepository passwordRepo;
  @Autowired EmailService emailService;
  @Autowired AuditLogServiceImpl auditLog;

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody UserRegistrationRequest req) {

    if (req.email != null && userRepo.findByEmail(req.email).isPresent()) {
        throw new FieldValidationException("email", "Primary email is already registered.");
    }

    if (req.spouseEmail != null && userRepo.findByEmail(req.spouseEmail).isPresent()) {
          throw new FieldValidationException("spouseEmail","Spouse email already registered");
    }

    Family family = new Family(req.gothram, Vedam.valueOf(req.vedam));
    familyRepo.save(family);
  
    Address addr = new Address(family, req.street, req.city, req.state, req.country, req.zip);
    addressRepo.save(addr);

    User primary = new User(family, req.firstName, req.lastName, req.email, req.phone, req.gender, "primary", true, false);
    User spouse = new User(family, req.spouseFirstName, req.spouseLastName, req.spouseEmail, req.spousePhone, req.spouseGender, "spouse", false, false);
    userRepo.save(primary);
    userRepo.save(spouse);

    Password pwd = new Password(primary, hashPassword(req.password));
    primary.setPassword(pwd);
    userRepo.save(primary);
    emailService.sendRegistrationNotice(primary.getFirstName(), req.lastName);
    auditLog.log("REGISTER", req.email, "User", String.valueOf(primary.getId()), "Registertion of user submitted: "+primary.getId() );
    return ResponseEntity.ok("Registered");
  }

  private String hashPassword(String raw) {
    return new BCryptPasswordEncoder().encode(raw);
  }
}

