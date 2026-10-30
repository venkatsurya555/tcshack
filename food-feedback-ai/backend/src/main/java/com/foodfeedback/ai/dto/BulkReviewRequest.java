package com.foodfeedback.ai.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class BulkReviewRequest {

    @NotEmpty(message = "Review list cannot be empty")
    private List<String> reviews;

    private Double similarityThreshold;

    public BulkReviewRequest() {}

    public BulkReviewRequest(List<String> reviews) {
        this.reviews = reviews;
    }

    public List<String> getReviews() {
        return reviews;
    }

    public void setReviews(List<String> reviews) {
        this.reviews = reviews;
    }

    public Double getSimilarityThreshold() {
        return similarityThreshold;
    }

    public void setSimilarityThreshold(Double similarityThreshold) {
        this.similarityThreshold = similarityThreshold;
    }
}
