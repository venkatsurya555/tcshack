package com.foodfeedback.ai.dto;

import java.time.Instant;

public class ReviewResponse {
    private String id;
    private String text;
    private String sentiment;
    private Double sentimentConfidence;
    private String groupId;
    private String groupLabel;
    private Double similarityToCentroid;
    private boolean outlier;
    private String source;
    private Instant createdAt;
    private String processingStatus;

    public ReviewResponse() {}

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

    public String getSentiment() {
        return sentiment;
    }

    public void setSentiment(String sentiment) {
        this.sentiment = sentiment;
    }

    public Double getSentimentConfidence() {
        return sentimentConfidence;
    }

    public void setSentimentConfidence(Double sentimentConfidence) {
        this.sentimentConfidence = sentimentConfidence;
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public String getGroupLabel() {
        return groupLabel;
    }

    public void setGroupLabel(String groupLabel) {
        this.groupLabel = groupLabel;
    }

    public Double getSimilarityToCentroid() {
        return similarityToCentroid;
    }

    public void setSimilarityToCentroid(Double similarityToCentroid) {
        this.similarityToCentroid = similarityToCentroid;
    }

    public boolean isOutlier() {
        return outlier;
    }

    public void setOutlier(boolean outlier) {
        this.outlier = outlier;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public String getProcessingStatus() {
        return processingStatus;
    }

    public void setProcessingStatus(String processingStatus) {
        this.processingStatus = processingStatus;
    }
}
