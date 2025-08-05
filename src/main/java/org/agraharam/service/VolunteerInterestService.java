package org.agraharam.service;

import java.util.List;

import org.agraharam.dto.VolunteerInterestAdminView;
import org.agraharam.dto.VolunteerInterestRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

public interface VolunteerInterestService {
    public ResponseEntity<?> submitVolunteerInterest(@RequestBody List<VolunteerInterestRequest> requests, String email) ;
    public List<VolunteerInterestRequest> getVolunteerInterest(String email);
    public List<VolunteerInterestAdminView> getAllVolunteerInterests();
}
