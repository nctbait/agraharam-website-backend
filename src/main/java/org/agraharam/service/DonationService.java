package org.agraharam.service;

import java.security.Principal;
import java.util.List;

import org.agraharam.dto.DonationRequest;
import org.agraharam.model.Donation;
import org.agraharam.model.User;
import org.agraharam.repository.DonationRepository;
import org.agraharam.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DonationService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DonationRepository donationRepository;
    @Autowired
    private AuditLogServiceImpl auditLog;

    public void saveDonation(DonationRequest request, Principal principal) {
        Donation donation = new Donation();
        donation.setDonorName(request.getDonorName());
        donation.setPhone(request.getPhone());
        donation.setEmail(request.getEmail());
        donation.setReason(request.getReason());
        donation.setAmount(request.getAmount());
        donation.setPaymentMethod(request.getPaymentMethod());
        donation.setConfirmationCode(request.getConfirmationCode());
        donation.setStatus("pending");

        if (principal != null) {
            User user = userRepository.findByEmail(principal.getName()).orElse(null);
            if (user != null) {
                donation.setUserId(user.getId());
                donation.setFamilyId(user.getFamily().getId());
            }
        }
        donationRepository.save(donation);
        auditLog.log("DONATION_SUBMITTED", donation.getEmail(), "Donation", String.valueOf(donation.getId()), "Donation submission by: "+ donation.getDonorName());
    }

    public List<Donation> getPendingDonations() {
        return donationRepository.findByStatus("pending");
    }

    public void bulkApprove(List<Long> ids, Principal principal) {
        ids.forEach(id -> {
            donationRepository.findById(id).ifPresent(d -> {
                d.setStatus("approved");
                donationRepository.save(d);
                auditLog.log("DONATION_APPROVED", principal.getName(), "Donation", String.valueOf(d.getId()), "Donation submission by: "+ d.getDonorName());
            });
        });
    }
    
    public void bulkReject(List<Long> ids, Principal principal) {
        ids.forEach(id -> {
            donationRepository.findById(id).ifPresent(d -> {
                d.setStatus("rejected");
                donationRepository.save(d);
                auditLog.log("DONATION_REJECTED", principal.getName(), "Donation", String.valueOf(d.getId()), "Donation submission by: "+ d.getDonorName());

            });
        });
    }

}
