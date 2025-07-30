package org.agraharam.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import org.agraharam.dto.IdListRequest;
import org.agraharam.dto.PendingEventPaymentDTO;
import org.agraharam.model.EventRegistration;
import org.agraharam.model.Payment;
import org.agraharam.repository.EventRegistrationRepository;
import org.agraharam.repository.PaymentRepository;
import org.agraharam.service.AuditLogServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/payments")
public class PaymentController {
    @Autowired
    PaymentRepository paymentRepository;
    @Autowired
    EventRegistrationRepository registrationRepository;
    @Autowired
    private AuditLogServiceImpl auditLogService;

    @GetMapping("/event-registration/pending-approval")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    public List<PendingEventPaymentDTO> getPendingEventPayments() {
        List<PendingEventPaymentDTO> retList = new ArrayList<>();
        List<Payment> paymentsList = paymentRepository.findByReferenceyTypeAndStatus("EventRegistration", "pending");
        for (Payment payment : paymentsList) {
            EventRegistration reg = registrationRepository.findById(payment.getReferenceId()).orElse(null);
            if (reg == null)
                return retList;
            PendingEventPaymentDTO dto = new PendingEventPaymentDTO();
            dto.setRegistrationId(reg.getId());
            dto.setUserName(reg.getUser().getFirstName() + " " + reg.getUser().getLastName());
            dto.setEventTitle(reg.getEvent().getTitle());
            dto.setUserEmail(reg.getUser().getEmail());
            dto.setAmount(payment.getAmount());
            dto.setConfirmation(payment.getConfirmation());
            dto.setSubmittedAt(payment.getPaymentDate());
            dto.setStatus(payment.getStatus());
            dto.setPaymentMethod(payment.getPaymentMethod());
            dto.setId(payment.getId());
            retList.add(dto);
        }
        return retList;
    }

    @PostMapping("/event-registration/approve")
    public ResponseEntity<?> approvePayment(@RequestBody IdListRequest request, Principal principal) {
        List<Long> ids = request.getIds();
        for (Long id : ids) {
            if (id != null) {
                Payment payment = paymentRepository.findById(id).orElse(null);
                if (payment != null) {
                    payment.setStatus("approved");
                    paymentRepository.save(payment);
                    auditLogService.log("APPROVE_EVENT_PAYMENT", principal.getName(), "UserPayment", String.valueOf(id),
                            "Approved event registration payment:" + id);
                }
            }
        }
        return ResponseEntity.ok("Approved");
    }

    @PostMapping("/event-registration/reject")
    public ResponseEntity<?> rejectPayment(@RequestBody IdListRequest request, Principal principal) {
        List<Long> ids = request.getIds();
        for (Long id : ids) {
            if (id != null) {
                Payment payment = paymentRepository.findById(id).orElse(null);
                if (payment != null) {
                    payment.setStatus("rejected");
                    paymentRepository.save(payment);
                    auditLogService.log("REJECT_EVENT_PAYMENT", principal.getName(), "UserPayment", String.valueOf(id),
                            "Rejected event registration payment:" + id);
                }
            }
        }
        return ResponseEntity.ok("Rejected");
    }

}
