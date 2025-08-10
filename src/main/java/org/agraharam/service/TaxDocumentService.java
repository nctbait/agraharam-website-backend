package org.agraharam.service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.agraharam.dto.UserTaxSummaryDTO;
import org.agraharam.model.Donation;
import org.agraharam.model.Payment;
import org.agraharam.model.User;
import org.agraharam.repository.DonationRepository;
import org.agraharam.repository.PaymentRepository;
import org.agraharam.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;

@Service
public class TaxDocumentService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PaymentRepository paymentRepo;

    @Autowired
    private DonationRepository donationRepo;

    public List<UserTaxSummaryDTO> getTaxSummary(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Long familyId = user.getFamily().getId();

        List<Long> userIds = userRepo.findByFamilyId(familyId).stream()
                .map(User::getId)
                .toList();

        Map<Integer, UserTaxSummaryDTO> summaryMap = new TreeMap<>(Collections.reverseOrder());

        // Membership
        for (Object[] row : paymentRepo.getApprovedMembershipByYear(userIds)) {
            int year = ((Number) row[0]).intValue();
            double amount = ((Number) row[1]).doubleValue();
            summaryMap.computeIfAbsent(year, y -> new UserTaxSummaryDTO()).setYear(year);
            summaryMap.get(year).setMembership(amount);
        }

        // Donations
        for (Object[] row : donationRepo.getApprovedDonationsByYear(userIds)) {
            int year = ((Number) row[0]).intValue();
            double amount = ((Number) row[1]).doubleValue();
            summaryMap.computeIfAbsent(year, y -> new UserTaxSummaryDTO()).setYear(year);
            summaryMap.get(year).setDonations(amount);
        }

        return new ArrayList<>(summaryMap.values());
    }

    public byte[] generateYearlyReceiptPdf(String email, int year) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get family members (primary + spouse) IDs
        List<Long> familyUserIds = user.getFamily().getUsers().stream()
                .map(User::getId)
                .toList();

        // Fetch approved tax-deductible payments
        List<Payment> payments = paymentRepo
                .findByUserIdInAndStatusAndTaxDeductibleTrueAndPaymentDateBetween(
                        familyUserIds, "approved",
                        LocalDate.of(year, 1, 1).atStartOfDay(),
                        LocalDate.of(year, 12, 31).atTime(23, 59, 59));

        // Fetch approved donations
        List<Donation> donations = donationRepo
                .findByFamilyIdAndStatusAndSubmittedAtBetween(
                        user.getFamily().getId(), "approved",
                        LocalDate.of(year, 1, 1).atStartOfDay(),
                        LocalDate.of(year, 12, 31).atTime(23, 59, 59));

        // Generate PDF
        return buildPdf(user, payments, donations, year);
    }

    private byte[] buildPdf(User user, List<Payment> payments, List<Donation> donations, int year) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            document.add(new Paragraph("Tax Summary for " + year));
            document.add(new Paragraph("Name: " + user.getFirstName() + " " + user.getLastName()));
            document.add(new Paragraph("Email: " + user.getEmail()));
            // document.add(new Paragraph("\nApproved Tax-Deductible Payments:"));
            double totalPayments = payments.stream().mapToDouble(Payment::getAmount).sum();
            if (totalPayments > 0) {
                document.add(new Paragraph("\nApproved Tax-Deductible Payments:"));
            }

            payments.forEach(p -> {
                try {
                    document.add(
                            new Paragraph(p.getPaymentType() + ": $" + p.getAmount() + " on " + p.getPaymentDate()));
                } catch (DocumentException e) {
                    throw new RuntimeException(e);
                }
            });
            double totalDonations = donations.stream().mapToDouble(Donation::getAmount).sum();
            if(totalDonations>0){
                document.add(new Paragraph("\nApproved Donations:"));
            }
            donations.forEach(d -> {
                try {
                    document.add(new Paragraph(d.getReason() + ": $" + d.getAmount() + " on " + d.getSubmittedAt()));
                } catch (DocumentException e) {
                    throw new RuntimeException(e);
                }
            });

            document.add(new Paragraph("\nTotal Tax-Deductible Amount: $" + (totalPayments + totalDonations)));

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }

}
