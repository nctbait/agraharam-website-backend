package org.agraharam.dto;

import lombok.Data;

@Data
public class DonationRequest {
    private String donorName;
    private String phone;
    private String email;
    private String reason;
    private Double amount;
    private String paymentMethod; // "ZELLE" or "PAYPAL"
    private String confirmationCode;
    private String captchaToken;
}
