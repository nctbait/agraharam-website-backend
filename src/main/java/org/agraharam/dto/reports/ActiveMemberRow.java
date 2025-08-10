// dto/reports/ActiveMemberRow.java
package org.agraharam.dto.reports;

import org.agraharam.model.User;

public record ActiveMemberRow(
        String firstName,
        String lastName,
        String email,
        String phone,
        Long familyId
) {
    public static ActiveMemberRow from(User u) {
        return new ActiveMemberRow(
                u.getFirstName(),
                u.getLastName(),
                u.getEmail(),
                u.getPhoneNumber(),
                u.getFamily() != null ? u.getFamily().getId() : null
        );
    }
}
