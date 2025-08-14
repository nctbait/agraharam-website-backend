package org.agraharam.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

import org.agraharam.dto.EventFinancialDto;
import org.agraharam.dto.TransactionRow;
import org.agraharam.model.Payment;
import org.agraharam.model.User;
import org.agraharam.repository.BillRepository;
import org.agraharam.repository.DonationRepository;
import org.agraharam.repository.EventRegistrationRepository;
import org.agraharam.repository.EventRepository;
import org.agraharam.repository.PaymentRepository;
import org.agraharam.repository.RefundRepository;
import org.agraharam.repository.UserMembershipRepository;
import org.agraharam.repository.UserRepository;
import org.agraharam.repository.VendorPaymentRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class ReportService {
  private final PaymentRepository paymentRepo;
  private final RefundRepository refundRepo;
  private final VendorPaymentRepository vendorPaymentRepo;
  private final BillRepository billRepo;
  private final DonationRepository donationRepo;
  private final EventRepository eventRepo;
  private final UserRepository userRepo;
  private final UserMembershipRepository membershipRepo;
  private final EventRegistrationRepository eventRegRepo;

  public List<TransactionRow> transactions(LocalDate start, LocalDate end) {
    LocalDateTime from = start != null ? start.atStartOfDay() : LocalDate.EPOCH.atStartOfDay();
    LocalDateTime to   = end   != null ? end.plusDays(1).atStartOfDay() : LocalDateTime.now();
    
    ZonedDateTime fromZonedDateTime = from.atZone(ZoneId.of("America/New_York"));
    OffsetDateTime fromOffset = fromZonedDateTime.toOffsetDateTime();

    ZonedDateTime toZonedDateTime = to.atZone(ZoneId.of("America/New_York"));
    OffsetDateTime toOffset = toZonedDateTime.toOffsetDateTime();

    List<TransactionRow> rows = new ArrayList<TransactionRow>(512);

    // 1) USER PAYMENTS (CREDIT)
    paymentRepo.findApprovedBetween(from, to).forEach(p -> {
      String context = resolveContextLabel(p.getReferenceyType(), p.getReferenceId());
      User counterPartyUser = p.getUser();
      String counterparty = counterPartyUser.getFirstName()+" "+counterPartyUser.getLastName();
      rows.add(new TransactionRow(
        p.getId(), "Payment", "CREDIT",
        BigDecimal.valueOf(p.getAmount()), p.getStatus(), p.getCreatedAt(), p.getPaymentMethod(),
        p.getReferenceyType(), context, p.getReferenceId(), counterparty
      ));
    });

    // 2) REFUNDS (DEBIT)
    refundRepo.findApprovedBetween(fromOffset, toOffset).forEach(r -> {
     //String source = "Refund";
      String context = resolveContextLabel(r.getReferenceType().name(), r.getReferenceId());
      String counterparty = "";
      if(r.getOriginalPaymentId()!=null){
        Payment originalPayment =paymentRepo.findById(r.getOriginalPaymentId()).orElse(null);
        if(originalPayment!=null){
            counterparty= originalPayment.getUser().getFirstName()+" "+originalPayment.getUser().getLastName();
        }
      }
      rows.add(new TransactionRow(
        r.getId(), "Refund", "DEBIT",
        r.getAmountApproved(), r.getStatus().name(), r.getCreatedAt().toLocalDateTime(), r.getMethod().name(),
        r.getReferenceType().name(), context, r.getReferenceId(), counterparty
      ));
    });

    // 3) VENDOR PAYMENTS (DEBIT)
    vendorPaymentRepo.findApprovedBetween(fromOffset, toOffset).forEach(vp -> {
      String source = "Vendor Payment";
      String context ="";
      Long refrenceId = null;
      if(vp.getEvent()!=null){
        context = vp.getEvent().getTitle();
        refrenceId=vp.getEvent().getId();
        source = "Event";
      }
      String counterparty =vp.getVendor().getName();
      rows.add(new TransactionRow(
        vp.getId(), "VendorPayment", "DEBIT",
        vp.getAmount(), vp.getStatus().name(), vp.getCreatedAt().toLocalDateTime(), vp.getPaymentMethod().name(),
        source, context, refrenceId, counterparty
      ));
    });

    // 4) BILLS (DEBIT)
    billRepo.findApprovedBetween(start, end).forEach(b -> {
      String source = "Bill";
      String context = b.getDescription();
      String counterparty = resolveUser(b.getMemberId());
      if(b.getEventId()!=null){
        source="Event";
      }
      rows.add(new TransactionRow(
        b.getId(), "Bill", "DEBIT",
        BigDecimal.valueOf(b.getAmount()), b.getStatus(), b.getSubmittedDate().atStartOfDay(), "zelle",
        source, context, b.getEventId(), counterparty));
    });

    // 5) DONATIONS (CREDIT)
    donationRepo.findByStatusApprovedBetween(from, to).forEach(d -> {
      String source = "Donation";
      String context = resolveUser(d.getUserId());
      String counterparty = d.getUserId() != null ? resolveUser(d.getUserId()) : nullSafe(d.getDonorName());
      rows.add(new TransactionRow(
        d.getId(), "Donation", "CREDIT",
        BigDecimal.valueOf(d.getAmount()), d.getStatus(), d.getSubmittedAt(), d.getPaymentMethod(),
        source, context, d.getUserId(), counterparty
      ));
    });

    rows.sort(Comparator.comparing(TransactionRow::occurredAt));
    return rows;
  }

  // Used by /events/{id}/financial
  public EventFinancialDto eventFinancial(Long eventId) {

    List<TransactionRow> rows = transactions(null, null).stream()
      .filter(r -> isEventLinked(r, eventId))
      .toList();

      BigDecimal income        = sum(rows, "CREDIT", Set.of("Payment","Donation"));
      BigDecimal refunds       = sum(rows, "DEBIT",  Set.of("Refund"));
      BigDecimal vendor        = sum(rows, "DEBIT",  Set.of("VendorPayment"));
      BigDecimal bills         = sum(rows, "DEBIT",  Set.of("Bill"));
      BigDecimal net = income.subtract(refunds).subtract(vendor).subtract(bills);

    return new EventFinancialDto(rows, income, refunds, vendor, bills, net);
  }

  private boolean isEventLinked(TransactionRow r, Long eventId) {
    // Treat anything whose context resolves to this event as linked.
    // Prefer consistency by setting referenceType=EVENT and referenceId=eventId
    if (r.referenceId() == null) return false;
    // If your mapping sometimes uses EVENT_REGISTRATION -> resolve to registration.eventId
    return switch (r.source()) {
      case "Event", "EventRegistration", "VendorPayment", "Bill", "Donation", "UserPayment", "Payment", "UserMembership", "Refund" -> {
        var refType = r.source();
        yield eventId.equals(resolveEventId(refType, r.referenceId()));
      }
      default -> false;
    };
  }

  private BigDecimal sum(List<TransactionRow> rows, String direction, Set<String> categories) {
    return rows.stream()
      .filter(r -> direction.equals(r.direction()) && categories.contains(r.category()))
      .map(TransactionRow::amount)
      .reduce(BigDecimal.ZERO, BigDecimal::add);
  }

  // ---------- context resolvers ----------
  private String resolveContextLabel(String referenceType, Long referenceId) {
    return switch (referenceType) {
        case "EventRegistration" -> eventRegRepo.findById(referenceId)
            .map(reg -> "Event: " + reg.getEvent().getTitle())
            .orElse("Registration #" + referenceId);
        case "Event" -> eventRepo.findById(referenceId)
            .map(ev -> "Event: " + ev.getTitle())
            .orElse("Event #" + referenceId);
        case "UserMembership" -> membershipRepo.findById(referenceId)
            .map(m -> "Membership: " + m.getMembershipType().getName())
            .orElse("Membership #" + referenceId);
        case "Bill" -> billRepo.findById(referenceId)
            .map(b -> "Bill: " + b.getDescription())
            .orElse("Bill #" + referenceId);
        case "Donation" -> donationRepo.findById(referenceId)
            .map(d -> "Donation: " + d.getReason())
            .orElse("Donation #" + referenceId);
        default -> referenceType + " #" + referenceId;
    };
}


  private Long resolveEventId(String type, Long refId) {
    if (type == null || refId == null) return null;
    return switch (type) {
      case "Event" -> refId;
      case "EventRegistration" -> eventRegRepo.findById(refId).map(r -> r.getEvent().getId()).orElse(null);
      // Donations/Bills/VendorPayments might point directly to EVENT or not at all
      default -> null;
    };
  }

  private String resolveUser(Long userId) {
    return userId == null ? "" : userRepo.findById(userId)
      .map(u -> u.getFirstName() + " " + u.getLastName() + " <" + u.getEmail() + ">")
      .orElse("User #" + userId);
  }

  private static String nullSafe(String s) { return s == null ? "" : s; }
}
