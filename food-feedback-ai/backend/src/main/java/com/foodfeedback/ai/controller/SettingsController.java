package com.foodfeedback.ai.controller;

import com.foodfeedback.ai.model.AppSetting;
import com.foodfeedback.ai.model.RestaurantBranch;
import com.foodfeedback.ai.model.RoutingRule;
import com.foodfeedback.ai.service.RestaurantOperationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/settings")
public class SettingsController {

    private final RestaurantOperationsService operationsService;

    @Autowired
    public SettingsController(RestaurantOperationsService operationsService) {
        this.operationsService = operationsService;
    }

    @GetMapping
    public ResponseEntity<List<AppSetting>> getSettings() {
        return ResponseEntity.ok(operationsService.getSettings());
    }

    @PutMapping("/{key}")
    public ResponseEntity<AppSetting> updateSetting(
            @PathVariable("key") String key,
            @RequestBody Map<String, String> body
    ) {
        String value = body.getOrDefault("value", "");
        AppSetting updated = operationsService.updateSetting(key, value);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/routing-rules")
    public ResponseEntity<List<RoutingRule>> getRoutingRules() {
        return ResponseEntity.ok(operationsService.getRoutingRules());
    }

    @PutMapping("/routing-rules/{id}")
    public ResponseEntity<RoutingRule> updateRoutingRule(
            @PathVariable("id") Long id,
            @RequestBody RoutingRule rule
    ) {
        RoutingRule updated = operationsService.updateRoutingRule(id, rule);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/branches")
    public ResponseEntity<List<RestaurantBranch>> getBranches() {
        return ResponseEntity.ok(operationsService.getBranches());
    }
}
