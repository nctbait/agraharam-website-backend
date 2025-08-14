package org.agraharam.dto;

import org.agraharam.model.EventAttendance;

public record AttendeeDTO(
    Long id,                      // attendance id
    String name,
    String relation,
    EventAttendance.PersonType type,
    boolean checkedIn
) {}