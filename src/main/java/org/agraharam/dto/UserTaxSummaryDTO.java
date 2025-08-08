package org.agraharam.dto;

import lombok.Data;

@Data
public class UserTaxSummaryDTO {
    private int year;
    private double membership;
    private double donations;
    private String downloadUrl; // placeholder for PDF (if needed)
}

