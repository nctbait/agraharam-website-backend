// AdminReportsController.java
package org.agraharam.controller;

import org.agraharam.dto.EventFinancialDto;
import org.agraharam.dto.reports.*;
import org.agraharam.model.*;
import org.agraharam.repository.*;
import org.agraharam.service.ReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/reports")
@PreAuthorize("hasAuthority('admin') or hasAuthority('superAdmin')")
@Transactional(readOnly = true)
public class AdminReportsController {

    private final EventRepository eventRepo;
    private final UserRepository userRepo;
    private final TaskRepository taskRepo;
    private final ReportService reportService;

    public AdminReportsController(
            EventRepository eventRepo,
            UserRepository userRepo,
            TaskRepository taskRepo,
            ReportService reportService
    ) {
        this.eventRepo = eventRepo;
        this.userRepo = userRepo;
        this.taskRepo = taskRepo;
        this.reportService = reportService;
    }

    // ---------- Helpers ----------
    private record Range(LocalDateTime start, LocalDateTime end) {}
    private Range toRange(LocalDate startDate, LocalDate endDate) {
        LocalDate s = (startDate != null) ? startDate : LocalDate.of(1970,1,1);
        LocalDate e = (endDate   != null) ? endDate   : LocalDate.of(3000,1,1);
        return new Range(s.atStartOfDay(), e.atTime(LocalTime.MAX));
    }

    private static void setCsvHeaders(HttpServletResponse resp, String filename) {
        resp.setContentType("text/csv; charset=UTF-8");
        resp.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"");
        resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
    }

    // ==========================================================
    // 1) TRANSACTION SUMMARY (payments + donations)
    // ==========================================================
    @GetMapping("/transactions")
    public void transactionSummary(
            HttpServletResponse resp,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "csv") String format
    ) throws Exception {
        List<org.agraharam.dto.TransactionRow> rows = reportService.transactions( startDate,  endDate);

        if ("json".equalsIgnoreCase(format)) {
            // Let Spring serialize JSON
            resp.setContentType(MediaType.APPLICATION_JSON_VALUE);
            String json = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(rows);
            resp.getWriter().write(json);
            return;
        }

        setCsvHeaders(resp, "transactions.csv");
        try (PrintWriter pw = resp.getWriter()) {
            pw.println("type,id,date,amount,method,direction,counterparty,referenceType,referenceId,status");
            for (org.agraharam.dto.TransactionRow r0 : rows) {
                pw.printf("%s,%s,%s,%.2f,%s,%s,%s,%s,%s,%s%n",
                        r0.category(), nullSafe(r0.id()), nullSafe(r0.occurredAt()),
                        r0.amount() == null ? 0.0 : r0.amount(),
                        csv(r0.method()), csv(r0.direction()),
                        csv(r0.counterparty()),
                        csv(r0.source()), nullSafe(r0.referenceId()),
                        csv(r0.status()));
            }
        }
    }

    // ==========================================================
    // 2) EVENT FINANCIAL (income vs expenses for one event)
    // ==========================================================
    @GetMapping("/events/{eventId}/financial")
    public void eventFinancial(
            HttpServletResponse resp,
            @PathVariable Long eventId,
            @RequestParam(defaultValue = "csv") String format
    ) throws Exception {

        EventFinancialDto report = reportService.eventFinancial(eventId);
        Event event = eventRepo.findById(eventId).orElse(null);
        if ("json".equalsIgnoreCase(format)) {
            resp.setContentType(MediaType.APPLICATION_JSON_VALUE);
            String json = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(report);
            resp.getWriter().write(json);
            return;
        }

        setCsvHeaders(resp, "event_financial.csv");
        try (PrintWriter pw = resp.getWriter()) {
            pw.printf("Event,%s%n", csv(event.getTitle()));
            pw.printf("Date,%s%n", event.getDate());
            pw.println();

            pw.println("id,category,date,amount,method,direction,contect,counterparty,source");
            for(org.agraharam.dto.TransactionRow p: report.rows()){
            
                pw.printf("%d,%s,%s,%.2f,%s,%s,%s,%s,%s%n",
                        p.id(),
                        p.category(),
                        p.occurredAt(),
                        p.amount() == null ? 0.0 : p.amount(),
                        csv(p.method()),
                        csv(p.direction()),
                        csv(p.context()),
                        csv(p.counterparty()),
                        csv(p.source()));
            }

            pw.println();
            pw.printf("Totals,,Income,%.2f,Refunds,%.2f,Vendor Expenses,%.2f,Bills,%.2f,Net,%.2f%n",
                    report.income(), report.refunds(), report.vendorExpenses(), report.bills(), report.net());
        }
    }

    // ==========================================================
    // 3) ACTIVE MEMBER LIST
    // ==========================================================
    @GetMapping("/members/active")
    public void activeMembers(
            HttpServletResponse resp,
            @RequestParam(defaultValue = "csv") String format
    ) throws Exception {
        List<User> users = userRepo.findActiveMembers(); // approved + accessRole=user (adjust filter as needed)
        List<ActiveMemberRow> rows = users.stream()
                .map(ActiveMemberRow::from)
                .sorted(Comparator.comparing(ActiveMemberRow::lastName).thenComparing(ActiveMemberRow::firstName))
                .toList();

        if ("json".equalsIgnoreCase(format)) {
            resp.setContentType(MediaType.APPLICATION_JSON_VALUE);
            String json = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(rows);
            resp.getWriter().write(json);
            return;
        }

        setCsvHeaders(resp, "active_members.csv");
        try (PrintWriter pw = resp.getWriter()) {
            pw.println("firstName,lastName,email,phone,familyId");
            for (ActiveMemberRow r0 : rows) {
                pw.printf("%s,%s,%s,%s,%s%n",
                        csv(r0.firstName()), csv(r0.lastName()),
                        csv(r0.email()), csv(r0.phone()),
                        nullSafe(r0.familyId()));
            }
        }
    }

    // ==========================================================
    // 4) NEW MEMBERS IN RANGE
    // ==========================================================
    @GetMapping("/members/new")
    public void newMembers(
            HttpServletResponse resp,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "csv") String format
    ) throws Exception {
        Range r = toRange(startDate, endDate);
        List<User> users = userRepo.findNewMembersBetween(r.start(), r.end());
        List<NewMemberRow> rows = users.stream().map(NewMemberRow::from).toList();

        if ("json".equalsIgnoreCase(format)) {
            resp.setContentType(MediaType.APPLICATION_JSON_VALUE);
            String json = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(rows);
            resp.getWriter().write(json);
            return;
        }

        setCsvHeaders(resp, "new_members.csv");
        try (PrintWriter pw = resp.getWriter()) {
            pw.println("firstName,lastName,email,phone,createdAt");
            for (NewMemberRow r0 : rows) {
                pw.printf("%s,%s,%s,%s,%s%n",
                        csv(r0.firstName()), csv(r0.lastName()),
                        csv(r0.email()), csv(r0.phone()),
                        nullSafe(r0.createdAt()));
            }
        }
    }

    // ==========================================================
    // 5) TASKS COMPLETED IN RANGE
    // ==========================================================
    @GetMapping("/tasks/completed")
    public void tasksCompleted(
            HttpServletResponse resp,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "csv") String format
    ) throws Exception {
        Range r = toRange(startDate, endDate);
        // If you have completedAt, use it here; otherwise fall back to createdAt range.
        List<Task> tasks = taskRepo.findCompletedBetween(r.start(), r.end());

        List<TaskCompletedRow> rows = tasks.stream().map(TaskCompletedRow::from).toList();

        if ("json".equalsIgnoreCase(format)) {
            resp.setContentType(MediaType.APPLICATION_JSON_VALUE);
            String json = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(rows);
            resp.getWriter().write(json);
            return;
        }

        setCsvHeaders(resp, "tasks_completed.csv");
        try (PrintWriter pw = resp.getWriter()) {
            pw.println("taskId,name,assignee,status,deadline,createdAt,eventTitle");
            for (TaskCompletedRow r0 : rows) {
                pw.printf("%s,%s,%s,%s,%s,%s,%s%n",
                        nullSafe(r0.taskId()), csv(r0.name()), csv(r0.assignee()),
                        csv(r0.status()), nullSafe(r0.deadline()), nullSafe(r0.createdAt()),
                        csv(r0.eventTitle()));
            }
        }
    }

    // ==========================================================
    // 6) TASK SUMMARY (counts by status)
    // ==========================================================
    @GetMapping("/tasks/summary")
    public ResponseEntity<?> taskSummary(
            @RequestParam(defaultValue = "csv") String format
    ) {
        List<Object[]> counts = taskRepo.countGroupByStatus(); // [status, count]

        if ("json".equalsIgnoreCase(format)) {
            Map<String, Long> map = counts.stream()
                    .collect(Collectors.toMap(
                            r -> String.valueOf(r[0]),
                            r -> ((Number) r[1]).longValue()
                    ));
            return ResponseEntity.ok(map);
        }

        // CSV
        StringBuilder sb = new StringBuilder();
        sb.append("status,count\n");
        for (Object[] r : counts) {
            sb.append(csv(String.valueOf(r[0]))).append(",").append(r[1]).append("\n");
        }
        byte[] bytes = sb.toString().getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"tasks_summary.csv\"")
                .body(bytes);
    }

    private static String csv(String s) {
        if (s == null) return "";
        // very simple csv escape
        String v = s.replace("\"", "\"\"");
        if (v.contains(",") || v.contains("\n")) return "\"" + v + "\"";
        return v;
    }
    private static String nullSafe(Object o) { return o == null ? "" : o.toString(); }
}
