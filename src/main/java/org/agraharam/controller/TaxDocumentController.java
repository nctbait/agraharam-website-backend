package org.agraharam.controller;

import java.security.Principal;
import java.util.List;

import org.agraharam.dto.UserTaxSummaryDTO;
import org.agraharam.service.TaxDocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class TaxDocumentController {

    @Autowired
    private TaxDocumentService taxService;

    @GetMapping("/api/user/tax-summary")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserTaxSummaryDTO>> getTaxSummary(Principal principal) {
        return ResponseEntity.ok(taxService.getTaxSummary(principal.getName()));
    }

    @GetMapping(value = "/api/user/tax-summary/{year}/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> downloadTaxPdf(@PathVariable int year, Principal principal) {
        // build the PDF as byte[]
        byte[] pdf = taxService.generateYearlyReceiptPdf(principal.getName(), year);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"NCTBA_Tax_" + year + ".pdf\"")
                .body(pdf);
    }

}
