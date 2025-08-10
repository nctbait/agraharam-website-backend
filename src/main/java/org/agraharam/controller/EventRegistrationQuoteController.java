// EventRegistrationQuoteController.java
package org.agraharam.controller;

import lombok.RequiredArgsConstructor;
import org.agraharam.dto.QuoteRequest;
import org.agraharam.dto.QuoteResponse;
import org.agraharam.service.EventQuoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/event-registrations")
@RequiredArgsConstructor
public class EventRegistrationQuoteController {

    private final EventQuoteService quoteService;

    @PostMapping("/quote")
    public ResponseEntity<QuoteResponse> quote(@RequestBody QuoteRequest req) {
        return ResponseEntity.ok(quoteService.calculate(req));
    }
}
