package com.foodfeedback.ai.controller;

import com.foodfeedback.ai.service.RestaurantOperationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/feedback")
public class FeedbackController {

    private final RestaurantOperationsService operationsService;

    @Autowired
    public FeedbackController(RestaurantOperationsService operationsService) {
        this.operationsService = operationsService;
    }

    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitFeedback(@RequestBody Map<String, Object> data) {
        Map<String, Object> resp = operationsService.submitFeedback(data);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getFeedbacks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long branch_id,
            @RequestParam(required = false) Integer rating,
            @RequestParam(required = false) String category
    ) {
        return ResponseEntity.ok(operationsService.getFeedbacks(search, branch_id, rating, category));
    }
}
