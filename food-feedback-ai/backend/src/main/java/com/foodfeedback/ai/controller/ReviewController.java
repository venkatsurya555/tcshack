package com.foodfeedback.ai.controller;

import com.foodfeedback.ai.dto.BulkReviewRequest;
import com.foodfeedback.ai.dto.ReviewRequest;
import com.foodfeedback.ai.dto.ReviewResponse;
import com.foodfeedback.ai.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/reviews", "/api/v1/ai/reviews"})
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@Valid @RequestBody ReviewRequest request) {
        ReviewResponse created = reviewService.createReview(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/bulk")
    public ResponseEntity<Map<String, Object>> createBulkReviews(@Valid @RequestBody BulkReviewRequest request) {
        List<ReviewResponse> results = reviewService.createBulkReviews(request);
        Map<String, Object> resp = new HashMap<>();
        resp.put("status", "SUCCESS");
        resp.put("processedCount", results.size());
        resp.put("reviews", results);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getReviews(
            @RequestParam(required = false) String groupId,
            @RequestParam(required = false) String sentiment,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        List<ReviewResponse> items = reviewService.getReviews(groupId, sentiment, search, page, size);
        long totalElements = reviewService.getReviewCount(groupId, sentiment, search);

        Map<String, Object> resp = new HashMap<>();
        resp.put("content", items);
        resp.put("totalElements", totalElements);
        resp.put("page", page);
        resp.put("size", size);
        resp.put("totalPages", (int) Math.ceil((double) totalElements / size));

        return ResponseEntity.ok(resp);
    }
}
