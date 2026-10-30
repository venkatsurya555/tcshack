package com.foodfeedback.ai.service;

import com.foodfeedback.ai.dto.*;
import com.foodfeedback.ai.model.Review;
import com.foodfeedback.ai.service.nlp.NativeClusteringService;
import com.foodfeedback.ai.service.nlp.NativeEmbeddingService;
import com.foodfeedback.ai.service.nlp.NativeSentimentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * 100% Pure Java AI Client & Inference Service.
 * Runs all AI NLP algorithms (sentiment analysis, 384-d semantic embedding,
 * agglomerative clustering, and topic labeling) in-process without Python dependencies.
 */
@Service
public class AiClientService {

    private static final Logger log = LoggerFactory.getLogger(AiClientService.class);

    private final NativeSentimentService sentimentService;
    private final NativeEmbeddingService embeddingService;
    private final NativeClusteringService clusteringService;
    private final double defaultSimilarityThreshold;

    @Autowired
    public AiClientService(
            NativeSentimentService sentimentService,
            NativeEmbeddingService embeddingService,
            NativeClusteringService clusteringService,
            @Value("${ai-service.default-similarity-threshold:0.65}") double defaultThreshold) {
        this.sentimentService = sentimentService;
        this.embeddingService = embeddingService;
        this.clusteringService = clusteringService;
        this.defaultSimilarityThreshold = defaultThreshold;
        log.info("Initialized Native Java AI NLP Engine (100% Java, 0% Python). Default threshold: {}", defaultThreshold);
    }

    /**
     * AI Service availability check: always true since the engine is embedded in Java.
     */
    public boolean isAiServiceAvailable() {
        return true;
    }

    public List<List<Double>> getEmbeddings(List<String> texts) {
        return embeddingService.generateBatch(texts);
    }

    public AiSentimentResponse getSentiment(List<String> texts) {
        return sentimentService.getSentimentResponse(texts);
    }

    public AiSentimentResponse.SentimentItem analyzeSentiment(String text) {
        return sentimentService.analyzeSentiment(text);
    }

    public List<AiSentimentResponse.SentimentItem> analyzeSentimentBatch(List<String> texts) {
        return sentimentService.analyzeBatch(texts);
    }

    public List<Double> generateEmbedding(String text) {
        return embeddingService.generateEmbedding(text);
    }

    public List<List<Double>> generateEmbeddingsBatch(List<String> texts) {
        return embeddingService.generateBatch(texts);
    }

    public AiClusterResponse clusterReviews(List<Review> reviews, Double threshold) {
        if (reviews == null || reviews.isEmpty()) {
            AiClusterResponse empty = new AiClusterResponse();
            empty.setGroups(Collections.emptyList());
            empty.setAssignments(Collections.emptyList());
            empty.setTotalClusters(0);
            empty.setUngroupedCount(0);
            return empty;
        }

        List<String> ids = new ArrayList<>(reviews.size());
        List<String> texts = new ArrayList<>(reviews.size());
        List<List<Double>> embeddings = new ArrayList<>(reviews.size());

        for (Review r : reviews) {
            ids.add(r.getId());
            texts.add(r.getText());
            embeddings.add(r.getEmbedding() != null ? r.getEmbedding() : Collections.emptyList());
        }

        // Ensure all reviews have embeddings
        boolean needsEmbeddings = embeddings.stream().anyMatch(e -> e == null || e.isEmpty());
        if (needsEmbeddings) {
            embeddings = embeddingService.generateBatch(texts);
            for (int i = 0; i < reviews.size(); i++) {
                if (i < embeddings.size()) {
                    reviews.get(i).setEmbedding(embeddings.get(i));
                }
            }
        }

        return clusterReviews(ids, texts, embeddings, threshold);
    }

    public AiClusterResponse clusterReviews(List<String> reviewIds, List<String> texts, List<List<Double>> embeddings, Double threshold) {
        double effectiveThreshold = (threshold != null && threshold > 0) ? threshold : defaultSimilarityThreshold;

        // Ensure embeddings exist
        if (embeddings == null || embeddings.isEmpty() || embeddings.get(0).isEmpty()) {
            embeddings = embeddingService.generateBatch(texts);
        }

        return clusteringService.cluster(reviewIds, texts, embeddings, effectiveThreshold);
    }
}
