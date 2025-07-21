package org.agraharam.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserRegistrationRequest {

    public String firstName, lastName, gender, gothram, vedam, phone, email, password;
  public String spouseFirstName, spouseLastName, spouseGender, spouseEmail, spousePhone;
  public String street, city, state, country, zip;
    
}
