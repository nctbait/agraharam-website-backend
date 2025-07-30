package org.agraharam.service;

import java.util.List;

import org.agraharam.dto.EventDTO;
import org.agraharam.dto.EventRegistrationDTO;
import org.agraharam.dto.UserEventViewDTO;

public interface EventRegistrationService {
    List<UserEventViewDTO> getMyRegistrations(String email);
    void register(EventRegistrationDTO dto, String email);
    void updateRegistration(Long id, EventRegistrationDTO dto, String email);
    void cancelRegistration(Long id, String email);
    public List<EventDTO> getAvailableEventsForFamily(String email) ;
    public List<EventDTO> getPastEventsForFamily(String email) ;
    public EventRegistrationDTO getRegistration(Long id, String email);
}

