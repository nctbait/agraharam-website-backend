package org.agraharam.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class EventOffering {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;            // e.g. "Kalyanam Sponsor"
    private String description;     // optional
    private Double price;
    private Integer maxQuantity;    // how many sponsors allowed

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;
}

