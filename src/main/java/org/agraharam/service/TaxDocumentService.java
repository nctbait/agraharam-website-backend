package org.agraharam.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.agraharam.dto.UserTaxSummaryDTO;
import org.agraharam.model.User;
import org.agraharam.repository.DonationRepository;
import org.agraharam.repository.PaymentRepository;
import org.agraharam.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

}
