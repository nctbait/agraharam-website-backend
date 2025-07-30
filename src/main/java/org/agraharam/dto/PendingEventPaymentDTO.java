package org.agraharam.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PendingEventPaymentDTO {
    private Long registrationId;
    private String eventTitle;
    private String userEmail;
    private String userName;
    private Double amount;
    private String confirmation;
    private LocalDateTime submittedAt;
    private String status;
    private String paymentMethod;
    private Long id;//paymentid
}
