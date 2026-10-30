package com.foodfeedback.ai.controller;

import com.foodfeedback.ai.dto.ComplaintGroupResponse;
import com.foodfeedback.ai.dto.ReviewResponse;
import com.foodfeedback.ai.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/groups", "/api/v1/ai/groups"})
public class ComplaintGroupController {

    private final ReviewService reviewService;

    @Autowired
    public ComplaintGroupController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<List<ComplaintGroupResponse>> getGroups() {
        return ResponseEntity.ok(reviewService.getGroups());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getGroupById(@PathVariable("id") String id) {
        ComplaintGroupResponse group = reviewService.getGroupById(id);
        if (group == null) {
            return ResponseEntity.notFound().build();
        }
        List<ReviewResponse> groupReviews = reviewService.getReviews(id, null, null, 0, 100);

        Map<String, Object> resp = new HashMap<>();
        resp.put("group", group);
        resp.put("reviews", groupReviews);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/recluster")
    public ResponseEntity<Map<String, Object>> recluster(
            @RequestBody(required = false) Map<String, Object> body
    ) {
        Double threshold = 0.65;
        if (body != null && body.containsKey("similarityThreshold")) {
            try {
                threshold = Double.parseDouble(body.get("similarityThreshold").toString());
            } catch (Exception ignored) {}
        }

        List<ComplaintGroupResponse> updatedGroups = reviewService.reclusterGroups(threshold);

        Map<String, Object> resp = new HashMap<>();
        resp.put("status", "SUCCESS");
        resp.put("thresholdUsed", threshold);
        resp.put("totalGroups", updatedGroups.size());
        resp.put("groups", updatedGroups);
        return ResponseEntity.ok(resp);
    }
}
