package org.agraharam.dto;

import lombok.Data;
import org.agraharam.model.EventOffering;

@Data
public class EventOfferingSummary {
    public String name;
    public String description;
    public Double price;
    public Integer maxQuantity;

    public static EventOfferingSummary from(EventOffering of){
        EventOfferingSummary dto= new EventOfferingSummary();
        dto.setDescription(of.getDescription());
        dto.setMaxQuantity(of.getMaxQuantity());
        dto.setName(of.getName());
        dto.setPrice(of.getPrice());
        return dto;
    }

}
