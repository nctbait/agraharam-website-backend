package org.agraharam.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class VariableMapping {

    private String name;         // e.g., "eventName"
    private String source;       // e.g., "event.title"

    // Constructors
    public VariableMapping() {}

    public VariableMapping(String name, String source) {
        this.name = name;
        this.source = source;
    }

    // Getters & Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}
