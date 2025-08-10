package org.agraharam.dto;

// AdminMetricsDTO.java
public record AdminMetricsDTO(
    long pendingRegistrations,
    long unapprovedDonations,
    long pendingEventPayments,
    long upcomingEvents,
    long openTasks,
    long overdueTasks,
    long pendingBills,
    long pendingVolunteerHours,
    long activeMembers,
    double donationsYTD
) {}

