package org.agraharam.service;

import java.util.List;

import org.agraharam.dto.PendingVolunteerHourDTO;
import org.agraharam.dto.VolunteerHourRequest;
import org.agraharam.dto.VolunteerHourSummaryDTO;
import org.agraharam.dto.VolunteerHourYearlyDTO;

public interface VolunteerHourService {
    List<VolunteerHourSummaryDTO> getFamilyHourSummary(String email);
    public void saveVolunteerHour(String email, VolunteerHourRequest req);
    public List<PendingVolunteerHourDTO> getPendingVolunteerHours();
    public void updateVolunteerHourStatus(Long id, String action);
    public void bulkUpdateVolunteerHourStatus(List<Long> ids, String action);
    List<VolunteerHourYearlyDTO> getYearlySummary(String name);
}

