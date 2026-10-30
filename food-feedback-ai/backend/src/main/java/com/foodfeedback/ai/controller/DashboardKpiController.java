package com.foodfeedback.ai.controller;

import com.foodfeedback.ai.service.RestaurantOperationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardKpiController {

    private final RestaurantOperationsService operationsService;

    @Autowired
    public DashboardKpiController(RestaurantOperationsService operationsService) {
        this.operationsService = operationsService;
    }

    @GetMapping("/kpis")
    public ResponseEntity<Map<String, Object>> getKPIs(
            @RequestParam(required = false) Long branch_id,
            @RequestParam(required = false) Long department_id,
            @RequestParam(defaultValue = "30") int days
    ) {
        return ResponseEntity.ok(operationsService.getKPIs(branch_id, department_id, days));
    }

    @GetMapping("/charts")
    public ResponseEntity<Map<String, Object>> getCharts(
            @RequestParam(required = false) Long branch_id,
            @RequestParam(required = false) Long department_id,
            @RequestParam(defaultValue = "30") int days
    ) {
        return ResponseEntity.ok(operationsService.getCharts(branch_id, department_id, days));
    }
}
