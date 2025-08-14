// projection (no @Entity)
package org.agraharam.dto;
public interface CheckinSearchRowView {
    Long getRegistrationId();
    Long getEventId();
    String getPersonType();
    Long getSourceId();
    String getName();
    String getRelation();
    Integer getCheckedInRaw(); 
    Long getAttendeeId();
    default Boolean getCheckedIn() {
      Integer v = getCheckedInRaw();
      return v != null && v != 0;
  }
  }
  