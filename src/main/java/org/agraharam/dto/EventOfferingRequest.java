package org.agraharam.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EventOfferingRequest {
    public String name;
    public String description;
    public Double price;
    public Integer maxQuantity;
}

