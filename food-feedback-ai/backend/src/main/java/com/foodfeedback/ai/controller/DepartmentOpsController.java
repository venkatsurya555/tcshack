package com.foodfeedback.ai.controller;

import com.foodfeedback.ai.model.Department;
import com.foodfeedback.ai.service.RestaurantOperationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/departments")
public class DepartmentOpsController {

    private final RestaurantOperationsService operationsService;

    @Autowired
    public DepartmentOpsController(RestaurantOperationsService operationsService) {
        this.operationsService = operationsService;
    }

    @GetMapping
    public ResponseEntity<List<Department>> getDepartments() {
        return ResponseEntity.ok(operationsService.getDepartments());
    }

    @GetMapping("/{deptCode}/operations")
    public ResponseEntity<Map<String, Object>> getOperations(
            @PathVariable("deptCode") String deptCode,
            @RequestParam(required = false) Long branch_id
    ) {
        return ResponseEntity.ok(operationsService.getDepartmentOperations(deptCode, branch_id));
    }
}
