package org.agraharam.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "family_id", nullable = false)
      private Family  family;

     private String street;
     private String city;
     private String state;
     private String  country;
     private String  zipCode;

     public Address() {
        // default for JPA
    }
    
    public Address(Family family, String street, String city, String state, String country, String zipCode) {
        this.family = family;
        this.street = street;
        this.city = city;
        this.state = state;
        this.country = country;
        this.zipCode = zipCode;
    }
    
    // Constructors, getters, setters
}
