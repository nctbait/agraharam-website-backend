package org.agraharam.service;

import java.util.List;
import java.util.stream.Collectors;

import org.agraharam.dto.UserMembershipDTO;
import org.agraharam.model.MembershipType;
import org.agraharam.model.Payment;
import org.agraharam.model.User;
import org.agraharam.model.UserMembership;
import org.agraharam.repository.PaymentRepository;
import org.agraharam.repository.UserMembershipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
public class UserMembershipServiceImpl implements UserMembershipService {

    @Autowired
    private  UserMembershipRepository membershipRepo;
    @Autowired
    private  PaymentRepository paymentRepo;

    @Override
    public List<UserMembershipDTO> getPendingRequests() {
        return membershipRepo.findByStatus("pending").stream()
    .filter(m -> m.getPayment() != null && "pending".equalsIgnoreCase(m.getPayment().getStatus()))
    .map(m -> {
        User user = m.getUser();
        MembershipType type = m.getMembershipType();
        Payment payment = m.getPayment();

        UserMembershipDTO dto = new UserMembershipDTO();
        dto.setId(m.getId());
        dto.setStartDate(m.getStartDate());
        dto.setEndDate(m.getEndDate());
        dto.setStatus(m.getStatus());

        // Flatten user
        if (user != null) {
            dto.setUserId(user.getId());
            dto.setUserName(user.getFirstName() + " " + user.getLastName());
            dto.setUserEmail(user.getEmail());
        }

        // Flatten membership type
        if (type != null) {
            dto.setMembershipTypeId(type.getId());
            dto.setMembershipTypeName(type.getName());
        }

        // Flatten payment
        if (payment != null) {
            dto.setPaymentId(payment.getId());
            dto.setAmount(payment.getAmount());
            dto.setConfirmation(payment.getConfirmation());
            dto.setPaymentStatus(payment.getStatus());
            dto.setPaymentMethod(payment.getPaymentMethod());
            dto.setPaymentDate(payment.getPaymentDate());
        }

        return dto;
    })
    .collect(Collectors.toList());

    }

    @Override
    @Transactional
    public void approveMemberships(List<Long> ids) {
        for (Long id : ids) {
            System.out.println("membership repo frin by id"+id);
            UserMembership membership = membershipRepo.findById(id).orElseThrow();
            membership.setStatus("active");

            Payment payment = membership.getPayment();
            System.out.println("payment repo frin by id"+payment.getId());
            if (payment != null) {
                payment.setStatus("approved");
                paymentRepo.save(payment);
            }

            membershipRepo.save(membership);
        }
    }

    @Override
    @Transactional
    public void rejectMemberships(List<Long> ids) {
        for (Long id : ids) {
            UserMembership membership = membershipRepo.findById(id).orElseThrow();
            membership.setStatus("rejected");

            Payment payment = membership.getPayment();
            if (payment != null) {
                payment.setStatus("rejected");
                paymentRepo.save(payment);
            }

            membershipRepo.save(membership);
        }
    }
}

