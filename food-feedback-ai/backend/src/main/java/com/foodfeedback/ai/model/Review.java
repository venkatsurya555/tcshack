package com.foodfeedback.ai.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "reviews")
public class Review {

    @Id
    private String id;

    private String text;

    @Indexed
    private String sentiment; // POSITIVE, NEGATIVE, NEUTRAL

    private Double sentimentConfidence;

    @Indexed
    private String groupId;

    private String groupLabel;

    private Double similarityToCentroid;

    private boolean outlier;

    private String source; // CSV, MANUAL, API

    private List<Double> embedding = new ArrayList<>();

    @Indexed
    private Instant createdAt;

    private Instant updatedAt;

    private String processingStatus; // COMPLETED, PENDING, FAILED

    public Review() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        this.processingStatus = "COMPLETED";
    }

    public Review(String text) {
        this();
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

    public List<Double> getEmbedding() {
        return embedding;
    }

    public void setEmbedding(List<Double> embedding) {
        this.embedding = embedding;
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

    public String getProcessingStatus() {
        return processingStatus;
    }

    public void setProcessingStatus(String processingStatus) {
        this.processingStatus = processingStatus;
    }
}
