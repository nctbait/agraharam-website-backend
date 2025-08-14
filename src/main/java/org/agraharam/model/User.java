package org.agraharam.model;

import java.sql.Timestamp;
import java.time.Instant;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import org.agraharam.enums.AccessRole;
import org.agraharam.enums.Gender;
import org.agraharam.enums.MaritalStatus;
import org.agraharam.enums.Role;

@Entity
@Setter
@Getter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "family_id", nullable = false)
//    @JsonIgnore
     private Family family;

     private String firstName;
     private String lastName;
     private String email;
     private String phoneNumber;

    @Enumerated(EnumType.STRING)
     private Gender gender;

    @Enumerated(EnumType.STRING)
     private Role role;
     
     @Enumerated(EnumType.STRING)
    private MaritalStatus maritalStatus = MaritalStatus.Single;

    @Column(name = "has_login")
    private boolean hasLogin;
    private boolean approved;
    
    private boolean totpEnabled;
    private String totpSecret;

    private Timestamp createdAt = Timestamp.from(Instant.now());

    @Enumerated(EnumType.STRING)
    @Column(name = "access_role")
    
    private AccessRole accessRole = AccessRole.user;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Password password;

    public User(){
        
    }
    
    public User(Family family, String firstName, String lastName, String email, String phoneNumber, String gender, String role, boolean hasLogin, boolean approved,MaritalStatus maritalStatus){
        this.family = family;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.gender = Gender.valueOf(gender);
        this.role = Role.valueOf(role);
        this.hasLogin = hasLogin;
        this.approved = approved;
        this.maritalStatus = maritalStatus;
    }
    // Constructors, getters, setters
}

