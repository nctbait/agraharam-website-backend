package org.agraharam.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import org.agraharam.enums.Vedam;

@Entity
@Setter
@Getter
public class Family {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String gothram;

    @Enumerated(EnumType.STRING)
    private Vedam vedam;

    @OneToMany(mappedBy = "family", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<User> users;

    @OneToOne(mappedBy = "family", cascade = CascadeType.ALL, orphanRemoval = true)
    private Address address;

    public Family() {
        // Required by JPA
    }

    public Family(String gothram, Vedam vedam) {
        this.gothram = gothram;
        this.vedam = vedam;
    }
}


