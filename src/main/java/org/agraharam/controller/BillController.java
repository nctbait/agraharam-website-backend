package org.agraharam.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.util.List;
import java.util.UUID;

import org.agraharam.dto.BillDTO;
import org.agraharam.dto.BillSubmissionRequest;
import org.agraharam.model.Bill;
import org.agraharam.model.Event;
import org.agraharam.repository.BillRepository;
import org.agraharam.repository.EventRepository;
import org.agraharam.repository.UserRepository;
import org.agraharam.service.AuditLogServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    @Autowired
    private BillRepository billRepo;

    @Autowired
    private AuditLogServiceImpl auditLogService;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private EventRepository eventRepository;

    @PostMapping(value = "/submit", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.ALL_VALUE })
    public ResponseEntity<?> submitBill(
            @RequestPart("file") MultipartFile file,
            @RequestPart("data") String rawJson, Principal principal) {

        try {
            // Save file to disk (or S3, etc.)

            ObjectMapper mapper = new ObjectMapper();
            BillSubmissionRequest data;

            try {
                data = mapper.readValue(rawJson, BillSubmissionRequest.class);
            } catch (IOException e) {
                return ResponseEntity.badRequest().body("Invalid JSON payload.");
            }
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get("uploads/bills");
            Files.createDirectories(uploadPath);
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            Bill bill = new Bill();
            bill.setMemberId(data.getMemberId());
            bill.setMemberRelation(data.getMemberRelation());
            bill.setAmount(data.getAmount());
            bill.setDescription(data.getDescription());
            bill.setEventId(data.getEventId());
            bill.setZelleId(data.getZelleId());
            bill.setZelleName(data.getZelleName());
            bill.setFilePath(filePath.toString());

            billRepo.save(bill);
            auditLogService.log("MEMBER_BILL_SUBMIT", principal.getName(), "Bill",
                    String.valueOf(bill.getId()), "Bill submitted, for membership id:" + data.getMemberId() + " " +
                            data.getMemberRelation() + " for amount:" + data.getAmount());

            return ResponseEntity.ok("Bill submitted successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to submit bill");
        }
    }

    @GetMapping("/admin/pending")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    public List<BillDTO> getPendingBills() {
        List<Bill> bills = billRepo.findByStatus("pending");

        return bills.stream().map(bill -> {
            String name = userRepo.findById(bill.getMemberId())
                .map(u -> u.getFirstName() + " " + u.getLastName())
                .orElse("Unknown");
                String eventName = "";
                if (bill.getEventId() != null) {
                    eventName = eventRepository.findById(bill.getEventId())
                                               .map(Event::getTitle)
                                               .orElse("");
                } 
            return BillDTO.from(bill, name,eventName);
        }).toList();
    }

    @PostMapping("/admin/{id}/approve")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    public ResponseEntity<?> approveBill(@PathVariable Long id, Principal principal) {
        
        Bill bill = billRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Bill not found"));
        bill.setStatus("approved");
        billRepo.save(bill);

        auditLogService.log("APPROVE_BILL", principal.getName(), "Bill",
                    String.valueOf(bill.getId()), "Bill Approved, for membership id:" + bill.getMemberId() + " " +
                    bill.getMemberRelation() + " for amount:" + bill.getAmount());
        return ResponseEntity.ok("Bill approved successfully");
    }

    @PostMapping("/admin/{id}/reject")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    public ResponseEntity<?> rejectBill(@PathVariable Long id, Principal principal) {
        
        Bill bill = billRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Bill not found"));
        bill.setStatus("approved");
        billRepo.save(bill);

        auditLogService.log("REJECT_BILL", principal.getName(), "Bill",
                    String.valueOf(bill.getId()), "Bill Rejected, for membership id:" + bill.getMemberId() + " " +
                    bill.getMemberRelation() + " for amount:" + bill.getAmount());
        return ResponseEntity.ok("Bill rejected successfully");
    }

    @PostMapping("/admin/bulk/approve")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    public ResponseEntity<?> approveBillsBulk(@PathVariable List<Long> ids, Principal principal) {
        
        List<Bill> bills = billRepo.findAllById(ids);
        for (Bill bill : bills) {    
            bill.setStatus("approved");
            billRepo.save(bill);

            auditLogService.logBatch("APPROVE_BILL", principal.getName(), "Bill",
                        String.valueOf(bill.getId()), "Bill Approved, for membership id:" + bill.getMemberId() + " " +
                        bill.getMemberRelation() + " for amount:" + bill.getAmount(),"Approve as batch by"+principal.getName());
        }
        return ResponseEntity.ok("Bills approved successfully");
    }

    @PostMapping("/admin/bulk/reject")
    @PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
    public ResponseEntity<?> rejectBillsBulk(@PathVariable List<Long> ids, Principal principal) {
        
        List<Bill> bills = billRepo.findAllById(ids);
        for (Bill bill : bills) {    
            bill.setStatus("approved");
            billRepo.save(bill);

            auditLogService.logBatch("REJECT_BILL", principal.getName(), "Bill",
                        String.valueOf(bill.getId()), "Bill Rejected, for membership id:" + bill.getMemberId() + " " +
                        bill.getMemberRelation() + " for amount:" + bill.getAmount(),"Rejected as batch by"+principal.getName());
        }
        return ResponseEntity.ok("Bills rejected successfully");
    }

}
