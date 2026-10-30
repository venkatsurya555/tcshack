package com.foodfeedback.ai.service;

import com.foodfeedback.ai.dto.*;
import com.foodfeedback.ai.model.ComplaintGroup;
import com.foodfeedback.ai.model.Review;
import com.foodfeedback.ai.repository.ReviewDataStore;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private static final Logger log = LoggerFactory.getLogger(ReviewService.class);

    private final ReviewDataStore dataStore;
    private final AiClientService aiClientService;

    @Autowired
    public ReviewService(ReviewDataStore dataStore, AiClientService aiClientService) {
        this.dataStore = dataStore;
        this.aiClientService = aiClientService;
    }

    @PostConstruct
    public void init() {
        if (dataStore.countReviews() == 0) {
            log.info("Database empty. Seeding realistic sample restaurant reviews...");
            seedSampleReviews();
        }
    }

    public ReviewResponse createReview(ReviewRequest request) {
        String reviewId = "REV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Instant now = Instant.now();

        AiSentimentResponse.SentimentItem sentimentItem = aiClientService.analyzeSentiment(request.getText());
        String sentiment = sentimentItem != null ? sentimentItem.getSentiment() : "NEUTRAL";
        Double confidence = sentimentItem != null ? sentimentItem.getConfidence() : 0.70;

        List<Double> embedding = aiClientService.generateEmbedding(request.getText());

        Review review = new Review();
        review.setId(reviewId);
        review.setText(request.getText().trim());
        review.setSentiment(sentiment);
        review.setSentimentConfidence(confidence);
        review.setEmbedding(embedding);
        review.setProcessingStatus("PROCESSED");
        review.setSource(request.getSource() != null ? request.getSource() : "MANUAL_INPUT");
        review.setCreatedAt(now);
        review.setUpdatedAt(now);
        review.setGroupId("ungrouped");
        review.setGroupLabel("Ungrouped / Outlier");
        review.setSimilarityToCentroid(0.0);
        review.setOutlier(true);

        assignToBestGroup(review);

        dataStore.saveReview(review);
        return mapToResponse(review);
    }

    public List<ReviewResponse> createBulkReviews(BulkReviewRequest request) {
        List<ReviewResponse> responses = new ArrayList<>();
        if (request.getReviews() == null || request.getReviews().isEmpty()) {
            return responses;
        }

        List<String> rawTexts = request.getReviews().stream()
                .map(String::trim)
                .filter(t -> !t.isEmpty())
                .collect(Collectors.toList());

        if (rawTexts.isEmpty()) {
            return responses;
        }

        List<AiSentimentResponse.SentimentItem> sentiments = aiClientService.analyzeSentimentBatch(rawTexts);
        List<List<Double>> embeddings = aiClientService.generateEmbeddingsBatch(rawTexts);

        Instant now = Instant.now();
        List<Review> newReviews = new ArrayList<>();

        for (int i = 0; i < rawTexts.size(); i++) {
            String reviewId = "REV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            String text = rawTexts.get(i);
            String sentiment = (sentiments != null && i < sentiments.size()) ? sentiments.get(i).getSentiment() : "NEUTRAL";
            Double confidence = (sentiments != null && i < sentiments.size()) ? sentiments.get(i).getConfidence() : 0.75;
            List<Double> embedding = (embeddings != null && i < embeddings.size()) ? embeddings.get(i) : Collections.emptyList();

            Review r = new Review();
            r.setId(reviewId);
            r.setText(text);
            r.setSentiment(sentiment);
            r.setSentimentConfidence(confidence);
            r.setEmbedding(embedding);
            r.setProcessingStatus("PROCESSED");
            r.setSource("BULK_UPLOAD");
            r.setCreatedAt(now.minusSeconds((rawTexts.size() - i) * 60L));
            r.setUpdatedAt(now);
            r.setGroupId("ungrouped");
            r.setGroupLabel("Ungrouped / Outlier");
            r.setSimilarityToCentroid(0.0);
            r.setOutlier(true);

            newReviews.add(r);
        }

        dataStore.saveAllReviews(newReviews);

        double threshold = request.getSimilarityThreshold() != null ? request.getSimilarityThreshold() : 0.65;
        reclusterGroups(threshold);

        for (Review r : newReviews) {
            Review refreshed = dataStore.findReviewById(r.getId()).orElse(r);
            responses.add(mapToResponse(refreshed));
        }

        return responses;
    }

    public List<ReviewResponse> getReviews(String groupId, String sentiment, String search, int page, int size) {
        List<Review> all = dataStore.findAllReviews();

        return all.stream()
                .filter(r -> groupId == null || groupId.trim().isEmpty() || r.getGroupId().equalsIgnoreCase(groupId.trim()))
                .filter(r -> sentiment == null || sentiment.trim().isEmpty() || r.getSentiment().equalsIgnoreCase(sentiment.trim()))
                .filter(r -> search == null || search.trim().isEmpty() || r.getText().toLowerCase().contains(search.toLowerCase().trim()))
                .sorted(Comparator.comparing(Review::getCreatedAt).reversed())
                .skip((long) page * size)
                .limit(size)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public long getReviewCount(String groupId, String sentiment, String search) {
        return dataStore.findAllReviews().stream()
                .filter(r -> groupId == null || groupId.trim().isEmpty() || r.getGroupId().equalsIgnoreCase(groupId.trim()))
                .filter(r -> sentiment == null || sentiment.trim().isEmpty() || r.getSentiment().equalsIgnoreCase(sentiment.trim()))
                .filter(r -> search == null || search.trim().isEmpty() || r.getText().toLowerCase().contains(search.toLowerCase().trim()))
                .count();
    }

    public List<ComplaintGroupResponse> getGroups() {
        List<ComplaintGroup> groups = dataStore.findAllGroups();
        long totalReviews = dataStore.countReviews();

        return groups.stream()
                .map(g -> mapGroupToResponse(g, totalReviews))
                .sorted((a, b) -> {
                    if (a.isOutlierGroup()) return 1;
                    if (b.isOutlierGroup()) return -1;
                    return Integer.compare(b.getReviewCount(), a.getReviewCount());
                })
                .collect(Collectors.toList());
    }

    public ComplaintGroupResponse getGroupById(String groupId) {
        ComplaintGroup group = dataStore.findGroupById(groupId).orElse(null);
        if (group == null) {
            return null;
        }
        return mapGroupToResponse(group, dataStore.countReviews());
    }

    public synchronized List<ComplaintGroupResponse> reclusterGroups(Double similarityThreshold) {
        double threshold = (similarityThreshold != null && similarityThreshold > 0.0) ? similarityThreshold : 0.65;
        List<Review> allReviews = dataStore.findAllReviews();
        if (allReviews.isEmpty()) {
            return Collections.emptyList();
        }

        log.info("Triggering AI re-clustering on {} reviews with threshold {}", allReviews.size(), threshold);

        AiClusterResponse clusterResponse = aiClientService.clusterReviews(allReviews, threshold);

        dataStore.deleteAllGroups();
        Instant now = Instant.now();

        List<ComplaintGroup> newGroups = new ArrayList<>();
        Map<String, Review> reviewMap = allReviews.stream().collect(Collectors.toMap(Review::getId, r -> r));

        if (clusterResponse.getGroups() != null) {
            for (AiClusterResponse.ClusterGroupItem cgItem : clusterResponse.getGroups()) {
                String gId = cgItem.getGroupId();
                boolean isUngrouped = "ungrouped".equalsIgnoreCase(gId);

                ComplaintGroup cg = new ComplaintGroup();
                cg.setId(gId);
                cg.setLabel(cgItem.getLabel());
                cg.setDescription(cgItem.getDescription());
                cg.setReviewCount(cgItem.getReviewIds() != null ? cgItem.getReviewIds().size() : 0);
                cg.setReviewIds(cgItem.getReviewIds() != null ? new ArrayList<>(cgItem.getReviewIds()) : new ArrayList<>());
                cg.setOutlierGroup(isUngrouped);
                cg.setCreatedAt(now);
                cg.setUpdatedAt(now);
                cg.setRepresentativeExamples(cgItem.getRepresentativeExamples() != null ? new ArrayList<>(cgItem.getRepresentativeExamples()) : new ArrayList<>());

                Map<String, Integer> sentSummary = new HashMap<>();
                sentSummary.put("POSITIVE", 0);
                sentSummary.put("NEGATIVE", 0);
                sentSummary.put("NEUTRAL", 0);

                if (cgItem.getReviewIds() != null) {
                    for (String rid : cgItem.getReviewIds()) {
                        Review r = reviewMap.get(rid);
                        if (r != null) {
                            r.setGroupId(gId);
                            r.setGroupLabel(cgItem.getLabel());
                            r.setOutlier(isUngrouped);
                            r.setUpdatedAt(now);
                            String s = r.getSentiment() != null ? r.getSentiment() : "NEUTRAL";
                            sentSummary.put(s, sentSummary.getOrDefault(s, 0) + 1);
                        }
                    }
                }
                cg.setSentimentSummary(sentSummary);

                newGroups.add(cg);
            }
        }

        // Also update individual similarities if assignments are returned
        if (clusterResponse.getAssignments() != null) {
            for (AiClusterResponse.ReviewAssignmentItem assign : clusterResponse.getAssignments()) {
                Review r = reviewMap.get(assign.getReviewId());
                if (r != null) {
                    r.setSimilarityToCentroid(assign.getSimilarityToCentroid());
                    r.setOutlier(assign.isOutlier());
                }
            }
        }

        dataStore.saveAllGroups(newGroups);
        dataStore.saveAllReviews(allReviews);

        log.info("Re-clustering completed. Formed {} semantic groups.", newGroups.size());
        return getGroups();
    }

    private void assignToBestGroup(Review review) {
        List<ComplaintGroup> groups = dataStore.findAllGroups();
        if (groups.isEmpty() || review.getEmbedding() == null || review.getEmbedding().isEmpty()) {
            return;
        }

        ComplaintGroup bestGroup = null;
        double bestSim = -1.0;

        for (ComplaintGroup g : groups) {
            if (g.isOutlierGroup() || g.getReviewIds() == null || g.getReviewIds().isEmpty()) {
                continue;
            }

            for (String repId : g.getRepresentativeReviewIds()) {
                Review rep = dataStore.findReviewById(repId).orElse(null);
                if (rep != null && rep.getEmbedding() != null && !rep.getEmbedding().isEmpty()) {
                    double sim = cosineSimilarity(review.getEmbedding(), rep.getEmbedding());
                    if (sim > bestSim) {
                        bestSim = sim;
                        bestGroup = g;
                    }
                }
            }
        }

        if (bestSim >= 0.65 && bestGroup != null) {
            review.setGroupId(bestGroup.getId());
            review.setGroupLabel(bestGroup.getLabel());
            review.setSimilarityToCentroid(Math.round(bestSim * 1000.0) / 1000.0);
            review.setOutlier(false);

            bestGroup.getReviewIds().add(review.getId());
            bestGroup.setReviewCount(bestGroup.getReviewIds().size());
            Map<String, Integer> sMap = bestGroup.getSentimentSummary();
            if (sMap != null) {
                sMap.put(review.getSentiment(), sMap.getOrDefault(review.getSentiment(), 0) + 1);
            }
            bestGroup.setUpdatedAt(Instant.now());
            dataStore.saveGroup(bestGroup);
        }
    }

    private double cosineSimilarity(List<Double> v1, List<Double> v2) {
        if (v1 == null || v2 == null || v1.size() != v2.size() || v1.isEmpty()) {
            return 0.0;
        }
        double dot = 0.0;
        double normA = 0.0;
        double normB = 0.0;
        for (int i = 0; i < v1.size(); i++) {
            double a = v1.get(i);
            double b = v2.get(i);
            dot += a * b;
            normA += a * a;
            normB += b * b;
        }
        if (normA <= 1e-9 || normB <= 1e-9) return 0.0;
        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    private void seedSampleReviews() {
        try {
            Path csvPath = Paths.get("../sample-data/sample_reviews.csv");
            if (!Files.exists(csvPath)) {
                csvPath = Paths.get("sample-data/sample_reviews.csv");
            }
            if (!Files.exists(csvPath)) {
                csvPath = Paths.get("d:/food review/food-feedback-ai/sample-data/sample_reviews.csv");
            }

            List<String> lines = Files.readAllLines(csvPath);
            List<String> items = new ArrayList<>();
            for (int i = 1; i < lines.size(); i++) {
                String line = lines.get(i).trim();
                if (line.isEmpty()) continue;
                String text;
                if (line.startsWith("\"")) {
                    int endQuote = line.indexOf("\"", 1);
                    if (endQuote > 1) {
                        text = line.substring(1, endQuote).trim();
                    } else {
                        text = line;
                    }
                } else {
                    String[] parts = line.split(",", 2);
                    text = parts[0].trim();
                }
                if (!text.isEmpty()) {
                    items.add(text);
                }
            }

            BulkReviewRequest req = new BulkReviewRequest();
            req.setReviews(items);
            req.setSimilarityThreshold(0.65);
            createBulkReviews(req);
            log.info("Successfully seeded {} reviews from sample CSV file.", items.size());
        } catch (Exception e) {
            log.warn("Could not read sample_reviews.csv directly; using built-in initial reviews: {}", e.getMessage());
            seedBuiltInFallbacks();
        }
    }

    private void seedBuiltInFallbacks() {
        List<String> samples = Arrays.asList(
                "My order took 45 minutes to arrive and was extremely delayed.",
                "The delivery was extremely slow, we waited almost an hour.",
                "We waited too long for our food, very sluggish service.",
                "The food was served freezing cold, completely unheated.",
                "My meal was lukewarm and not hot enough.",
                "Soup was served cold, had to send it back.",
                "The pasta was way too salty and over-seasoned.",
                "Burger patty was totally burnt and bitter.",
                "Found a hair in my salad bowl, completely disgusting.",
                "They overcharged us on the final bill with unexpected charges.",
                "The waiter was extremely rude and rolled his eyes at us.",
                "The soup spilled all over inside the takeaway bag.",
                "Portion size was tiny for the expensive price charged.",
                "Absolutely delicious food, fresh ingredients and wonderful service!"
        );
        BulkReviewRequest req = new BulkReviewRequest(samples);
        req.setSimilarityThreshold(0.65);
        createBulkReviews(req);
    }

    private ReviewResponse mapToResponse(Review r) {
        ReviewResponse resp = new ReviewResponse();
        resp.setId(r.getId());
        resp.setText(r.getText());
        resp.setSentiment(r.getSentiment());
        resp.setSentimentConfidence(r.getSentimentConfidence());
        resp.setGroupId(r.getGroupId());
        resp.setGroupLabel(r.getGroupLabel());
        resp.setSimilarityToCentroid(r.getSimilarityToCentroid());
        resp.setOutlier(r.isOutlier());
        resp.setSource(r.getSource());
        resp.setCreatedAt(r.getCreatedAt());
        resp.setProcessingStatus(r.getProcessingStatus());
        return resp;
    }

    private ComplaintGroupResponse mapGroupToResponse(ComplaintGroup g, long totalReviews) {
        ComplaintGroupResponse resp = new ComplaintGroupResponse();
        resp.setId(g.getId());
        resp.setLabel(g.getLabel());
        resp.setDescription(g.getDescription());
        resp.setReviewCount(g.getReviewCount());
        double pct = totalReviews > 0 ? ((double) g.getReviewCount() / totalReviews) * 100.0 : 0.0;
        resp.setPercentage(Math.round(pct * 10.0) / 10.0);
        resp.setSentimentSummary(g.getSentimentSummary() != null ? g.getSentimentSummary() : Collections.emptyMap());
        resp.setRepresentativeReviewIds(g.getRepresentativeReviewIds() != null ? g.getRepresentativeReviewIds() : Collections.emptyList());
        resp.setRepresentativeExamples(g.getRepresentativeExamples() != null ? g.getRepresentativeExamples() : Collections.emptyList());
        resp.setOutlierGroup(g.isOutlierGroup());
        resp.setCreatedAt(g.getCreatedAt());
        resp.setUpdatedAt(g.getUpdatedAt());
        return resp;
    }
}
