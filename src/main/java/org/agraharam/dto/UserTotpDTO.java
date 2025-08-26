package org.agraharam.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
public class UserTotpDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private boolean totpEnabled;
    private String totpSecret;

}
