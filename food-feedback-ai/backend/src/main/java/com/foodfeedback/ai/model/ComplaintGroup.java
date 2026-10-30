package com.foodfeedback.ai.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "complaint_groups")
public class ComplaintGroup {

    @Id
    private String id;

    @Indexed
    private String label;

    private String description;

    private int reviewCount;

    private boolean outlierGroup;

    private List<String> reviewIds = new ArrayList<>();

    private Map<String, Integer> sentimentSummary = new HashMap<>();

    private List<String> representativeReviewIds = new ArrayList<>();

    private List<String> representativeExamples = new ArrayList<>();

    private Instant createdAt;

    private Instant updatedAt;

    public ComplaintGroup() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public ComplaintGroup(String id, String label, String description) {
        this();
        this.id = id;
        this.label = label;
        this.description = description;
    }

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

    public boolean isOutlierGroup() {
        return outlierGroup;
    }

    public void setOutlierGroup(boolean outlierGroup) {
        this.outlierGroup = outlierGroup;
    }

    public List<String> getReviewIds() {
        return reviewIds;
    }

    public void setReviewIds(List<String> reviewIds) {
        this.reviewIds = reviewIds;
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
}
