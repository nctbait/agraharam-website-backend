package org.agraharam.controller;

import java.util.ArrayList;
import java.util.List;

import org.agraharam.dto.UserBillDTO;
import org.agraharam.dto.UserPaymentDTO;
import org.agraharam.model.Donation;
import org.agraharam.model.User;
import org.agraharam.repository.BillRepository;
import org.agraharam.repository.DonationRepository;
import org.agraharam.repository.PaymentRepository;
import org.agraharam.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/user")
public class UserPaymentsController {

    @Autowired
    private PaymentRepository paymentRepo;

    @Autowired
    private BillRepository billRepo;

    @Autowired
    UserRepository userRepo;

    @Autowired
    DonationRepository donationRepo;

    @GetMapping("/payments")
    public List<UserPaymentDTO> getFamilyPayments(@RequestParam Long userId) {
        User primary = userRepo.findById(userId).orElse(null);
        User spouse = null;
        List<Long> userIds = new ArrayList<>();

        if (primary != null) {
            userIds.add(primary.getId());
            spouse = primary.getFamily().getUsers().stream()
                    .filter(u -> "spouse".equalsIgnoreCase(u.getRole().name()))
                    .findFirst()
                    .orElse(null);
            if (spouse != null) {
                userIds.add(spouse.getId());
            }
        }
        List<UserPaymentDTO> result = new ArrayList<>();
        
        result.addAll(donationRepo.findByUserIdIn(userIds).stream()
        .map(UserPaymentDTO::from)
        .toList());

        result.addAll(paymentRepo.findByUserIdIn(userIds).stream()
                .map(UserPaymentDTO::from)
                .toList());

        return result;
    }

    @GetMapping("/bills")
    public List<UserBillDTO> getFamilyBills(@RequestParam Long userId) {
        User primary = userRepo.findById(userId).orElse(null);
        User spouse = null;
        List<Long> userIds = new ArrayList<>();
        if (primary != null) {
            userIds.add(primary.getId());
            spouse = primary.getFamily().getUsers().stream()
                    .filter(u -> "spouse".equalsIgnoreCase(u.getRole().name()))
                    .findFirst()
                    .orElse(null);
            if (spouse != null) {
                userIds.add(spouse.getId());
            }
        }
        return billRepo.findByMemberIdIn(userIds).stream()
                .map(UserBillDTO::from)
                .toList();
    }
}
