package com.foodfeedback.ai.controller;

import com.foodfeedback.ai.model.UserAccount;
import com.foodfeedback.ai.service.RestaurantOperationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/staff")
public class StaffController {

    private final RestaurantOperationsService operationsService;

    @Autowired
    public StaffController(RestaurantOperationsService operationsService) {
        this.operationsService = operationsService;
    }

    @GetMapping
    public ResponseEntity<List<UserAccount>> getStaff(
            @RequestParam(required = false) Long department_id,
            @RequestParam(required = false) Long branch_id
    ) {
        return ResponseEntity.ok(operationsService.getStaff(department_id, branch_id));
    }

    @PostMapping
    public ResponseEntity<UserAccount> createStaff(@RequestBody UserAccount staff) {
        UserAccount created = operationsService.createStaff(staff);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<UserAccount> toggleStaffStatus(@PathVariable("id") Long id) {
        UserAccount updated = operationsService.toggleStaffStatus(id);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/workload")
    public ResponseEntity<List<Map<String, Object>>> getStaffWorkload() {
        return ResponseEntity.ok(operationsService.getStaffWorkload());
    }
}
