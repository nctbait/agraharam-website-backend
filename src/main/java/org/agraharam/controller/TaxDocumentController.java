package org.agraharam.controller;

import java.security.Principal;
import java.util.List;

import org.agraharam.dto.UserTaxSummaryDTO;
import org.agraharam.service.TaxDocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TaxDocumentController {
    
    @Autowired
    private TaxDocumentService taxService;

    @GetMapping("/api/user/tax-summary")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserTaxSummaryDTO>> getTaxSummary(Principal principal) {
        return ResponseEntity.ok(taxService.getTaxSummary(principal.getName()));
    }

}
