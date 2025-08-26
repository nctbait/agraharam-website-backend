package org.agraharam.controller;

import java.security.InvalidKeyException;
import java.security.Principal;
import java.util.Map;

import org.agraharam.model.User;
import org.agraharam.repository.UserRepository;
import org.agraharam.service.TotpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user/security/totp")
public class TotpController {
    @Autowired private TotpService totp;
   @Autowired private  UserRepository users;


  @PostMapping("/begin-setup")
  @PreAuthorize("hasAnyAuthority('user','admin','superAdmin')")
  public Map<String,String> beginSetup(Principal p) {
    // issuer label appears in authenticator apps
    return totp.beginSetup(currentUserId(p), "AgraharamNC", p.getName());
  }

  @PostMapping("/enable")
  @PreAuthorize("hasAnyAuthority('user','admin','superAdmin')")
  public Map<String,String> enable(@RequestBody Map<String,String> b, Principal p) throws InvalidKeyException {
    totp.enable(currentUserId(p), b.get("secret"), b.get("code"));
    return Map.of("status","enabled");
  }

  @PostMapping("/disable")
  @PreAuthorize("hasAnyAuthority('user','admin','superAdmin')")
  public Map<String,String> disable(@RequestBody Map<String,String> b, Principal p) {
    totp.disable(currentUserId(p), b.get("confirm")); // optional challenge
    return Map.of("status","disabled");
  }

  private Long currentUserId(Principal p){
    User u = users.findByEmail(p.getName()).orElse(null);
    if(u!=null){
        return u.getId();
    }
    return null;
  }
}

