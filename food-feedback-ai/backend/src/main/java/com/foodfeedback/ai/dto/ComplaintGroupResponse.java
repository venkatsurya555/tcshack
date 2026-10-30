package com.foodfeedback.ai.dto;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ComplaintGroupResponse {
    private String id;
    private String label;
    private String description;
    private int reviewCount;
    private double percentageOfAllReviews;
    private boolean outlierGroup;
    private Map<String, Integer> sentimentSummary = new HashMap<>();
    private List<String> representativeReviewIds = new ArrayList<>();
    private List<String> representativeExamples = new ArrayList<>();
    private Instant createdAt;
    private Instant updatedAt;
    private List<ReviewResponse> reviews = new ArrayList<>();

    public ComplaintGroupResponse() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(int reviewCount) {
        this.reviewCount = reviewCount;
    }

    public double getPercentageOfAllReviews() {
        return percentageOfAllReviews;
    }

    public void setPercentageOfAllReviews(double percentageOfAllReviews) {
        this.percentageOfAllReviews = percentageOfAllReviews;
    }

    public void setPercentage(double pct) {
        this.percentageOfAllReviews = pct;
    }

    public double getPercentage() {
        return this.percentageOfAllReviews;
    }

    public boolean isOutlierGroup() {
        return outlierGroup;
    }

    public void setOutlierGroup(boolean outlierGroup) {
        this.outlierGroup = outlierGroup;
    }

    public Map<String, Integer> getSentimentSummary() {
        return sentimentSummary;
    }

    public void setSentimentSummary(Map<String, Integer> sentimentSummary) {
        this.sentimentSummary = sentimentSummary;
    }

    public List<String> getRepresentativeReviewIds() {
        return representativeReviewIds;
    }

    public void setRepresentativeReviewIds(List<String> representativeReviewIds) {
        this.representativeReviewIds = representativeReviewIds;
    }

    public List<String> getRepresentativeExamples() {
        return representativeExamples;
    }

    public void setRepresentativeExamples(List<String> representativeExamples) {
        this.representativeExamples = representativeExamples;
    }

    public void setRepresentativeTexts(List<String> texts) {
        this.representativeExamples = texts;
    }

    public List<String> getRepresentativeTexts() {
        return this.representativeExamples;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<ReviewResponse> getReviews() {
        return reviews;
    }

    public void setReviews(List<ReviewResponse> reviews) {
        this.reviews = reviews;
    }
}
