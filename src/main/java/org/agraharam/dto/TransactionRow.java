package org.agraharam.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionRow(
  Long id,                        // underlying record id
  String category,                // Payment | Refund | VendorPayment | Bill | Donation
  String direction,               // CREDIT or DEBIT (DEBIT = money out)
  BigDecimal amount,              // signed or unsigned (we’ll keep it unsigned here)
  String status,                  // approved/pending/void
  LocalDateTime occurredAt,
  String method,                  // ZELLE, PAYPAL, CHECK, etc.
  String source,                  // Membership | Event Registration | Vendor | Bill | Donation
  String context,                 // e.g., "Deepavali 2025", "Membership: FAMILY", "Bill: INV-1029"
  Long referenceId,               // the ref id that context refers to (eventId, billId, etc.)
  String counterparty             // user email/name or vendor name
) {}
