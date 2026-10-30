package com.foodfeedback.ai.controller;

import com.foodfeedback.ai.dto.DashboardStatsResponse;
import com.foodfeedback.ai.dto.TrendResponse;
import com.foodfeedback.ai.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping({"/api/dashboard", "/api/v1/ai/dashboard"})
public class DashboardController {

    private final DashboardService dashboardService;

    @Autowired
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }

    @GetMapping("/trends")
    public ResponseEntity<List<TrendResponse>> getTrends() {
        return ResponseEntity.ok(dashboardService.getTrends());
    }
}
