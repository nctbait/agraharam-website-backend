package org.agraharam.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EventRequest {
    public String title;
    public String description;
    public String date;
    public String time;
    public String location;
    public String locationUrl;
    public Integer capacity;
    public Boolean waitlist;
    public String registrationDeadline;
    public List<PricingTierRequest> pricing;
    public List<EventOfferingRequest> offerings;
}