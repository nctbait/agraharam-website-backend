package org.agraharam.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MembershipUpgradeRequest {
    private Long membershipTypeId;
    private String paymentMethod; // "zelle" or "paypal"
    private String confirmation;
    private String recipientName;
}
