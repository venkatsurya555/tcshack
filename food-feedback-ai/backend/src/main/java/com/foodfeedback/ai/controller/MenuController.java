package com.foodfeedback.ai.controller;

import com.foodfeedback.ai.model.MenuItem;
import com.foodfeedback.ai.service.RestaurantOperationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/menu")
public class MenuController {

    private final RestaurantOperationsService operationsService;

    @Autowired
    public MenuController(RestaurantOperationsService operationsService) {
        this.operationsService = operationsService;
    }

    @GetMapping
    public ResponseEntity<List<MenuItem>> getMenuItems(
            @RequestParam(required = false) Long branch_id,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(operationsService.getMenuItems(branch_id, category, search));
    }

    @PostMapping
    public ResponseEntity<MenuItem> createMenuItem(@RequestBody MenuItem item) {
        MenuItem created = operationsService.createMenuItem(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}/toggle-availability")
    public ResponseEntity<MenuItem> toggleAvailability(@PathVariable("id") Long id) {
        MenuItem updated = operationsService.toggleMenuAvailability(id);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }
}
