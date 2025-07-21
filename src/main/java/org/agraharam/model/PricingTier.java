package org.agraharam.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class PricingTier {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String membershipTier;
    private Double basePrice;
    private Integer includedGuests;
    private Double additionalGuestPrice;
    private Integer maxGuests;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;
}