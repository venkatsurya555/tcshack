package com.foodfeedback.ai.controller;

import com.foodfeedback.ai.dto.*;
import com.foodfeedback.ai.service.AiClientService;
import com.foodfeedback.ai.service.nlp.NativeEmbeddingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Pure Java NLP Microservice Controller.
 * Exposes the standard NLP endpoints directly from Spring Boot, eliminating the Python FastAPI service.
 */
@RestController
@RequestMapping({"/nlp", "/api/v1/nlp"})
public class NlpController {

    private final AiClientService aiClientService;

    @Autowired
    public NlpController(AiClientService aiClientService) {
        this.aiClientService = aiClientService;
    }

    @PostMapping("/embeddings")
    public ResponseEntity<AiEmbeddingResponse> getEmbeddings(@RequestBody AiEmbeddingRequest request) {
        if (request.getTexts() == null || request.getTexts().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        List<List<Double>> embeddings = aiClientService.getEmbeddings(request.getTexts());
        AiEmbeddingResponse response = new AiEmbeddingResponse();
        response.setEmbeddings(embeddings);
        response.setDimension(NativeEmbeddingService.DIMENSION);
        response.setModel("java-semantic-projection-384d");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/sentiment")
    public ResponseEntity<AiSentimentResponse> getSentiment(@RequestBody AiSentimentRequest request) {
        if (request.getTexts() == null || request.getTexts().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        AiSentimentResponse response = aiClientService.getSentiment(request.getTexts());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/cluster")
    public ResponseEntity<AiClusterResponse> cluster(@RequestBody AiClusterRequest request) {
        List<String> ids = new ArrayList<>();
        List<String> texts = new ArrayList<>();

        if (request.getReviews() != null && !request.getReviews().isEmpty()) {
            for (AiClusterRequest.ReviewItem item : request.getReviews()) {
                ids.add(item.getId());
                texts.add(item.getText());
            }
        } else if (request.getReviewIds() != null && request.getTexts() != null) {
            ids.addAll(request.getReviewIds());
            texts.addAll(request.getTexts());
        } else {
            return ResponseEntity.badRequest().build();
        }

        Double threshold = request.getSimilarityThreshold() != null ? request.getSimilarityThreshold() : 0.65;
        List<List<Double>> embeddings = request.getEmbeddings();

        AiClusterResponse resp = aiClientService.clusterReviews(ids, texts, embeddings, threshold);
        return ResponseEntity.ok(resp);
    }
}
