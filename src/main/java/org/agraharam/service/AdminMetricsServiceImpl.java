package org.agraharam.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.agraharam.dto.AdminMetricsDTO;
import org.agraharam.enums.Role;
import org.agraharam.repository.BillRepository;
import org.agraharam.repository.DonationRepository;
import org.agraharam.repository.EventRepository;
import org.agraharam.repository.PaymentRepository;
import org.agraharam.repository.TaskRepository;
import org.agraharam.repository.UserRepository;
import org.agraharam.repository.VolunteerHourRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// AdminMetricsServiceImpl.java
@Service
@Transactional(readOnly = true)
public class AdminMetricsServiceImpl implements AdminMetricsService {

    private final UserRepository userRepo;
    private final DonationRepository donationRepo;
    private final PaymentRepository paymentRepo;
    private final EventRepository eventRepo;
    private final TaskRepository taskRepo;
    private final BillRepository billRepo;
    private final VolunteerHourRepository vhRepo;

    public AdminMetricsServiceImpl(
        UserRepository userRepo,
        DonationRepository donationRepo,
        PaymentRepository paymentRepo,
        EventRepository eventRepo,
        TaskRepository taskRepo,
        BillRepository billRepo,
        VolunteerHourRepository vhRepo
    ) {
        this.userRepo = userRepo;
        this.donationRepo = donationRepo;
        this.paymentRepo = paymentRepo;
        this.eventRepo = eventRepo;
        this.taskRepo = taskRepo;
        this.billRepo = billRepo;
        this.vhRepo = vhRepo;
    }

    @Override
    public AdminMetricsDTO getMetrics() {
        LocalDate now = LocalDate.now();
        LocalDate startOfYear = now.withDayOfYear(1);

        long pendingRegistrations = userRepo.countByApprovedFalseAndHasLoginTrue(); // adjust to your flags
        long unapprovedDonations   = donationRepo.countByStatusIgnoreCase("pending");
        long pendingEventPayments  = paymentRepo.countByReferenceyTypeAndStatusIgnoreCase("EventRegistration", "pending");
        long upcomingEvents        = eventRepo.countByDateGreaterThanEqual(now);
        long openTasks             = taskRepo.countByStatusIn(List.of("PENDING","IN_PROGRESS"));
        long overdueTasks          = taskRepo.countByStatusInAndDeadlineBefore(List.of("PENDING","IN_PROGRESS"), now);
        long pendingBills          = billRepo.countByStatusIgnoreCase("pending");
        long pendingVolunteerHours = vhRepo.countByStatusIgnoreCase("pending");
        long activeMembers         = userRepo.countByRoleAndApprovedTrue(Role.primary);
        Double donationsYTD        = donationRepo.sumAmountByStatusAndSubmittedAtBetween(
                                        "approved",
                                        startOfYear.atStartOfDay(),
                                        now.atTime(LocalTime.MAX)
                                    );
        return new AdminMetricsDTO(
            pendingRegistrations,
            unapprovedDonations,
            pendingEventPayments,
            upcomingEvents,
            openTasks,
            overdueTasks,
            pendingBills,
            pendingVolunteerHours,
            activeMembers,
            donationsYTD == null ? 0.0 : donationsYTD
        );
    }
}

