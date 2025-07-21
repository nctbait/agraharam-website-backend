package org.agraharam.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FieldErrorResponse {
    private String field;
    private String message;

    public FieldErrorResponse(String field, String message) {
        this.field = field;
        this.message = message;
    }
}
