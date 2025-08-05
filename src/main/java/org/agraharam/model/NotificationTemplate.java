package org.agraharam.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Getter
@Setter
@Table(name = "notification_template")
public class NotificationTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String type; // e.g., registration, eventReminder
    private String channel; // email, sms, inApp
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String body;

    private boolean active = true;

    @ElementCollection
    @CollectionTable(name = "notification_template_variables", joinColumns = @JoinColumn(name = "template_id"))
    private List<VariableMapping> variables = new ArrayList<>();

    // Getters & Setters
}
