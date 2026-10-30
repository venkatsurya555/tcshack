package com.foodfeedback.ai.controller;

import com.foodfeedback.ai.model.ComplaintTicket;
import com.foodfeedback.ai.model.UserAccount;
import com.foodfeedback.ai.service.PriorityScoringService;
import com.foodfeedback.ai.service.RestaurantOperationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/complaints")
public class ComplaintController {

    private final RestaurantOperationsService operationsService;
    private final PriorityScoringService priorityScoringService;

    @Autowired
    public ComplaintController(
            RestaurantOperationsService operationsService,
            PriorityScoringService priorityScoringService) {
        this.operationsService = operationsService;
        this.priorityScoringService = priorityScoringService;
    }

    @GetMapping
    public ResponseEntity<List<ComplaintTicket>> getComplaints(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status_filter,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) Long department_id,
            @RequestParam(required = false) Long branch_id,
            @RequestParam(required = false) Boolean overdue_only
    ) {
        return ResponseEntity.ok(operationsService.getComplaints(search, status_filter, priority, department_id, branch_id, overdue_only));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getTicketDetail(@PathVariable("id") Long id) {
        Map<String, Object> detail = operationsService.getTicketDetail(id);
        if (detail == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(detail);
    }

    @GetMapping("/track/{ticketNumber}")
    public ResponseEntity<Map<String, Object>> trackTicketPublic(@PathVariable("ticketNumber") String ticketNumber) {
        Map<String, Object> track = operationsService.trackTicketPublic(ticketNumber);
        if (track == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(track);
    }

    @PostMapping("/priority/calculate")
    public ResponseEntity<Map<String, Object>> calculatePriority(@RequestBody Map<String, Object> body) {
        Double severity = body.containsKey("severity") && body.get("severity") != null
                ? Double.parseDouble(body.get("severity").toString()) : null;
        Double frequency = body.containsKey("frequency") && body.get("frequency") != null
                ? Double.parseDouble(body.get("frequency").toString()) : null;
        Double trend = body.containsKey("trend") && body.get("trend") != null
                ? Double.parseDouble(body.get("trend").toString()) : null;

        PriorityScoringService.PriorityResult res = priorityScoringService.calculatePriority(severity, frequency, trend);
        return ResponseEntity.ok(res.toMap());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable("id") Long id,
            @RequestBody Map<String, String> body,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        UserAccount user = operationsService.getMe(authHeader);
        String status = body.get("status");
        String notes = body.get("notes");

        // Backend Rule Verification: Cannot resolve ticket without prior manager verification
        if ("Resolved".equalsIgnoreCase(status)) {
            Map<String, Object> detail = operationsService.getTicketDetail(id);
            if (detail == null) return ResponseEntity.notFound().build();

            Object verifiedAt = detail.get("verified_at") != null ? detail.get("verified_at") : detail.get("verifiedAt");
            if (verifiedAt == null) {
                Map<String, Object> err = new HashMap<>();
                err.put("error", "VerificationRequired");
                err.put("message", "Mandatory manager verification is required before closing a ticket as Resolved. Submit for manager verification first.");
                err.put("ticket_id", id);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
            }

            // Must be manager or admin to perform final close
            boolean isManager = user != null && (
                    "restaurant_manager".equalsIgnoreCase(user.getRole()) ||
                    "branch_manager".equalsIgnoreCase(user.getRole()) ||
                    "super_admin".equalsIgnoreCase(user.getRole())
            );
            if (!isManager) {
                Map<String, Object> err = new HashMap<>();
                err.put("error", "UnauthorizedResolution");
                err.put("message", "Unauthorized: Only Restaurant Managers and Super Admins can close complaints as Resolved.");
                err.put("ticket_id", id);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(err);
            }
        }

        ComplaintTicket updated = operationsService.updateTicketStatus(id, status, notes, user != null ? user.getFullName() : "Staff");
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<ComplaintTicket> assignTicket(
            @PathVariable("id") Long id,
            @RequestBody Map<String, Object> body,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        UserAccount user = operationsService.getMe(authHeader);
        Long deptId = body.containsKey("department_id") && body.get("department_id") != null
                ? Long.parseLong(body.get("department_id").toString()) : null;
        Long staffId = body.containsKey("assigned_staff_id") && body.get("assigned_staff_id") != null
                ? Long.parseLong(body.get("assigned_staff_id").toString()) : null;
        String reason = (String) body.get("reassignment_reason");

        ComplaintTicket updated = operationsService.assignTicket(id, deptId, staffId, reason, user != null ? user.getFullName() : "Manager");
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/investigation")
    public ResponseEntity<Map<String, Object>> addInvestigation(
            @PathVariable("id") Long id,
            @RequestBody Map<String, String> body,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        UserAccount user = operationsService.getMe(authHeader);
        String note = body.get("note");
        String type = body.getOrDefault("note_type", "investigation");
        Map<String, Object> resp = operationsService.addInvestigationNote(id, note, type, user != null ? user.getFullName() : "Investigator");
        if (resp == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/{id}/corrective-action")
    public ResponseEntity<ComplaintTicket> recordCorrectiveAction(
            @PathVariable("id") Long id,
            @RequestBody Map<String, String> body,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        UserAccount user = operationsService.getMe(authHeader);
        String rootCause = body.get("root_cause");
        String corrective = body.get("corrective_action");
        String preventive = body.get("preventive_action");

        ComplaintTicket updated = operationsService.recordCorrectiveAction(id, rootCause, corrective, preventive, user != null ? user.getFullName() : "Specialist");
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/verify")
    public ResponseEntity<?> verifyResolution(
            @PathVariable("id") Long id,
            @RequestBody Map<String, Object> body,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        UserAccount user = operationsService.getMe(authHeader);

        // Authorization check: Only restaurant_manager, branch_manager, or super_admin can verify
        boolean isAuthorizedManager = user != null && (
                "restaurant_manager".equalsIgnoreCase(user.getRole()) ||
                "branch_manager".equalsIgnoreCase(user.getRole()) ||
                "super_admin".equalsIgnoreCase(user.getRole())
        );

        if (!isAuthorizedManager) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", "Forbidden");
            err.put("message", "Unauthorized: Only Restaurant Managers and Super Admins can verify complaint resolutions.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(err);
        }

        boolean approved = Boolean.parseBoolean(body.getOrDefault("approved", "true").toString());
        String notes = (String) body.get("verification_notes");

        ComplaintTicket updated = operationsService.verifyResolution(id, approved, notes, user.getFullName());
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/reopen")
    public ResponseEntity<ComplaintTicket> reopenTicket(
            @PathVariable("id") Long id,
            @RequestParam(required = false) String reopen_reason,
            @RequestBody(required = false) Map<String, String> body,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        UserAccount user = operationsService.getMe(authHeader);
        String reason = reopen_reason != null ? reopen_reason : (body != null ? body.get("reopen_reason") : "Guest requested re-investigation");
        ComplaintTicket updated = operationsService.reopenTicket(id, reason, user != null ? user.getFullName() : "Guest");
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/satisfaction")
    public ResponseEntity<ComplaintTicket> submitSatisfaction(
            @PathVariable("id") Long id,
            @RequestBody Map<String, Object> body
    ) {
        int score = body.containsKey("score") ? Integer.parseInt(body.get("score").toString()) : 5;
        String comment = (String) body.get("comment");
        ComplaintTicket updated = operationsService.submitSatisfaction(id, score, comment);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }
}
