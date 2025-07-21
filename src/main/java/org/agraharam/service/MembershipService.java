package org.agraharam.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.agraharam.audit.Auditable;
import org.agraharam.dto.CurrentMembershipResponse;
import org.agraharam.dto.MembershipUpgradeRequest;
import org.agraharam.model.MembershipType;
import org.agraharam.model.Payment;
import org.agraharam.model.User;
import org.agraharam.model.UserMembership;
import org.agraharam.repository.MembershipTypeRepository;
import org.agraharam.repository.PaymentRepository;
import org.agraharam.repository.UserMembershipRepository;
import org.agraharam.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class MembershipService {

    private final MembershipTypeRepository membershipTypeRepository;
    private final UserMembershipRepository userMembershipRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    public MembershipService(
        MembershipTypeRepository membershipTypeRepository,
        UserMembershipRepository userMembershipRepository,
        PaymentRepository paymentRepository,
        UserRepository userRepository
    ) {
        this.membershipTypeRepository = membershipTypeRepository;
        this.userMembershipRepository = userMembershipRepository;
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
    }

    public List<MembershipType> getAvailableMemberships() {
        List<MembershipType> memberships = membershipTypeRepository.findByIsActiveTrueOrderByPriceAsc();
    
        // Inject 'Free' manually at the beginning
        MembershipType free = new MembershipType();
        free.setName("Free");
        free.setDescription("Default free membership for new users");
        free.setPrice(0.0);
        free.setDurationMonths(0);
        free.setIsActive(true);
        free.setCreatedAt(LocalDateTime.now());
    
        memberships.add(0, free);
        return memberships;
    }
    
    public void upgradeMembership(Long userId, Long membershipTypeId) {
        MembershipType type = membershipTypeRepository.findById(membershipTypeId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid membership"));

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid user"));

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = type.getDurationMonths() >= 999 ? null : startDate.plusMonths(type.getDurationMonths());

        // Save user_membership
        UserMembership membership = new UserMembership();
        membership.setUser(user);
        membership.setMembershipType(type);
        membership.setStartDate(startDate);
        membership.setEndDate(endDate);
        membership.setStatus("active");
        userMembershipRepository.save(membership);

        // Save payment
        Payment payment = new Payment();
        payment.setUser(user);
        payment.setAmount(type.getPrice());
        payment.setPaymentType("membership");
        payment.setPaymentDate(LocalDateTime.now());
        payment.setReferenceId(membership.getId());
        payment.setDescription(type.getName() + " membership");
        payment.setTaxDeductible(true);
        paymentRepository.save(payment);
    }

    public CurrentMembershipResponse getCurrentMembership(Long userId) {
    return userMembershipRepository.findTopByUserIdAndStatusOrderByStartDateDesc(userId, "active")
        .map(m -> new CurrentMembershipResponse(
            m.getMembershipType().getName(),
            m.getStartDate(),
            m.getEndDate()
        ))
        .orElse(new CurrentMembershipResponse("Free", null, null));
}

public void createPendingMembership(Long userId, MembershipUpgradeRequest request) {
    MembershipType type = membershipTypeRepository.findById(request.getMembershipTypeId())
        .orElseThrow(() -> new RuntimeException("Membership type not found"));

    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));

    LocalDate startDate = LocalDate.now();
    LocalDate endDate = type.getDurationMonths() >= 999 ? null : startDate.plusMonths(type.getDurationMonths());

    // Save Payment with status = pending
    Payment payment = new Payment();
    payment.setUser(user);
    payment.setAmount(type.getPrice());
    payment.setPaymentType("membership");
    payment.setPaymentDate(LocalDateTime.now());
    payment.setTaxDeductible(true);
    payment.setDescription(type.getName() + " membership - via " + request.getPaymentMethod());

    payment.setRecipientName(request.getRecipientName());    
    payment.setConfirmation(request.getConfirmation());

    payment.setStatus("pending");
    paymentRepository.save(payment);

    // Save Membership with status = pending
    UserMembership membership = new UserMembership();
    membership.setUser(user);
    membership.setMembershipType(type);
    membership.setStartDate(startDate);
    membership.setEndDate(endDate);
    membership.setStatus("pending");
    membership.setPayment(payment);

    userMembershipRepository.save(membership);
}


}

