package org.agraharam.model;

import jakarta.persistence.*;
import lombok.Getter; 
import lombok.Setter;

@Entity @Table(name = "home_settings")
@Getter @Setter
public class HomeSettings {
  @Id
  private Long id; // always 1

  // store as raw JSON string; map to DTO via ObjectMapper
  @Column(columnDefinition = "json", nullable = false)
  private String payload;

  @Column(name = "updated_at", nullable = false, columnDefinition = "timestamp")
  private java.sql.Timestamp updatedAt;

  private String updatedBy;
}
