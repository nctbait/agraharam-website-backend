package org.agraharam.exception;

import java.util.Map;

import org.agraharam.dto.FieldErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<?> handleEmailAlreadyExists(EmailAlreadyExistsException ex) {
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(FieldValidationException.class)
    public ResponseEntity<FieldErrorResponse> handleFieldValidation(FieldValidationException ex) {
        return ResponseEntity
        .status(HttpStatus.UNPROCESSABLE_ENTITY) // 422
        .body(new FieldErrorResponse(ex.getField(), ex.getMessage()));
    }
    // (Optional) Handle other exceptions gracefully
}
