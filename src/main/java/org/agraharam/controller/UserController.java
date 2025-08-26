package org.agraharam.controller;

import org.agraharam.dto.UserTotpDTO;
import org.agraharam.model.User;
import org.agraharam.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public List<User> listUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/me")
    public UserTotpDTO aboutMe(Principal p){
        User u = userService.aboutMe(p);
        if(u!=null){
            return new UserTotpDTO(u.getId(),u.getFirstName(),u.getLastName(),u.getEmail(),u.getRole().name(),Boolean.valueOf(u.isTotpEnabled()),u.getTotpSecret());
        }
        return null;
    }
}
