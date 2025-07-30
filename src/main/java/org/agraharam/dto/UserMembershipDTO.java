package org.agraharam.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserMembershipDTO {
    private Long id;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;

    private Long userId;
    private String userName;
    private String userEmail;

    private Long membershipTypeId;
    private String membershipTypeName;

    private Long paymentId;
    private Double amount;
    private String confirmation;
    private String paymentStatus;
    private String paymentMethod;
    private LocalDateTime paymentDate;
}


