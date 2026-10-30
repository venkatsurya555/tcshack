package com.foodfeedback.ai.dto;

import java.util.List;

public class AiClusterRequest {

    public static class ReviewItem {
        private String id;
        private String text;

        public ReviewItem() {}

        public ReviewItem(String id, String text) {
            this.id = id;
            this.text = text;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }

    private List<ReviewItem> reviews;
    private List<String> reviewIds;
    private List<String> texts;
    private List<List<Double>> embeddings;
    private Double similarityThreshold;
    private String algorithm; // agglomerative or dbscan

    public AiClusterRequest() {}

    public AiClusterRequest(List<String> reviewIds, List<String> texts, List<List<Double>> embeddings, Double similarityThreshold, String algorithm) {
        this.reviewIds = reviewIds;
        this.texts = texts;
        this.embeddings = embeddings;
        this.similarityThreshold = similarityThreshold;
        this.algorithm = algorithm;
    }

    public List<ReviewItem> getReviews() {
        return reviews;
    }

    public void setReviews(List<ReviewItem> reviews) {
        this.reviews = reviews;
    }

    public List<String> getReviewIds() {
        return reviewIds;
    }

    public void setReviewIds(List<String> reviewIds) {
        this.reviewIds = reviewIds;
    }

    public List<String> getTexts() {
        return texts;
    }

    public void setTexts(List<String> texts) {
        this.texts = texts;
    }

    public List<List<Double>> getEmbeddings() {
        return embeddings;
    }

    public void setEmbeddings(List<List<Double>> embeddings) {
        this.embeddings = embeddings;
    }

    public Double getSimilarityThreshold() {
        return similarityThreshold;
    }

    public void setSimilarityThreshold(Double similarityThreshold) {
        this.similarityThreshold = similarityThreshold;
    }

    public String getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }
}
