package com.foodfeedback.ai.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {
    private long totalReviews;
    private int totalGroups;
    private double negativePercentage;
    private String mostFrequentCategory;
    private long ungroupedCount;
    private Map<String, Long> sentimentDistribution = new HashMap<>();
    private List<CategoryBreakdownItem> categoryBreakdown = new ArrayList<>();

    public static class CategoryBreakdownItem {
        private String id;
        private String label;
        private int count;
        private double percentage;
        private boolean outlier;

        public CategoryBreakdownItem() {}

        public CategoryBreakdownItem(String id, String label, int count, double percentage, boolean outlier) {
            this.id = id;
            this.label = label;
            this.count = count;
            this.percentage = percentage;
            this.outlier = outlier;
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

        public int getCount() {
            return count;
        }

        public void setCount(int count) {
            this.count = count;
        }

        public double getPercentage() {
            return percentage;
        }

        public void setPercentage(double percentage) {
            this.percentage = percentage;
        }

        public boolean isOutlier() {
            return outlier;
        }

        public void setOutlier(boolean outlier) {
            this.outlier = outlier;
        }
    }

    public DashboardStatsResponse() {}

    public long getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(long totalReviews) {
        this.totalReviews = totalReviews;
    }

    public int getTotalGroups() {
        return totalGroups;
    }

    public void setTotalGroups(int totalGroups) {
        this.totalGroups = totalGroups;
    }

    public void setTotalComplaintGroups(long count) {
        this.totalGroups = (int) count;
    }

    public double getNegativePercentage() {
        return negativePercentage;
    }

    public void setNegativePercentage(double negativePercentage) {
        this.negativePercentage = negativePercentage;
    }

    public void setNegativeFeedbackPercentage(double negativePercentage) {
        this.negativePercentage = negativePercentage;
    }

    public String getMostFrequentCategory() {
        return mostFrequentCategory;
    }

    public void setMostFrequentCategory(String mostFrequentCategory) {
        this.mostFrequentCategory = mostFrequentCategory;
    }

    public long getUngroupedCount() {
        return ungroupedCount;
    }

    public void setUngroupedCount(long ungroupedCount) {
        this.ungroupedCount = ungroupedCount;
    }

    public void setUngroupedComplaintsCount(long ungroupedCount) {
        this.ungroupedCount = ungroupedCount;
    }

    public Map<String, Long> getSentimentDistribution() {
        return sentimentDistribution;
    }

    public void setSentimentDistribution(Map<String, Long> sentimentDistribution) {
        this.sentimentDistribution = sentimentDistribution;
    }

    public List<CategoryBreakdownItem> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(List<CategoryBreakdownItem> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }
}
