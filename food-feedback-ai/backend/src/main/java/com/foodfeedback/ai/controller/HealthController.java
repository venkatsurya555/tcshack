package com.foodfeedback.ai.controller;

import com.foodfeedback.ai.service.AiClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping({"/api/health", "/api/v1/health"})
public class HealthController {

    private final AiClientService aiClientService;

    @Autowired
    public HealthController(AiClientService aiClientService) {
        this.aiClientService = aiClientService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "food-feedback-ai-backend");
        status.put("runtime", "Java 21 / Spring Boot");
        status.put("aiEngine", "Native Java NLP Engine (100% Java)");
        status.put("aiAvailable", aiClientService.isAiServiceAvailable());
        status.put("pythonDependency", false);
        status.put("embeddingDimension", 384);
        status.put("clusteringAlgorithm", "Agglomerative Hierarchical (Java Native)");
        status.put("timestamp", Instant.now().toString());
        return ResponseEntity.ok(status);
    }
}
