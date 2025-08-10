// dto/reports/NewMemberRow.java
package org.agraharam.dto.reports;

import org.agraharam.model.User;

import java.time.LocalDateTime;
import java.time.ZoneId;

public record NewMemberRow(
        String firstName,
        String lastName,
        String email,
        String phone,
        LocalDateTime createdAt
) {
    public static NewMemberRow from(User u) {
        return new NewMemberRow(
                u.getFirstName(),
                u.getLastName(),
                u.getEmail(),
                u.getPhoneNumber(),
                LocalDateTime.ofInstant(u.getCreatedAt().toInstant(),ZoneId.systemDefault()) 
        );
    }
}
