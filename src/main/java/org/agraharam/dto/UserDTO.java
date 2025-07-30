package org.agraharam.dto;

import org.agraharam.model.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String fullName;
    private String email;
    private String role;

    public static UserDTO fromEntity(User u) {
        String fullName = (u.getFirstName() + " " + u.getLastName()).trim();

        return new UserDTO(u.getId(), fullName , u.getEmail(), u.getAccessRole().name());
    }
}

