package com.foodfeedback.ai.dto;

import java.util.List;

public class AiClusterResponse {

    public static class ClusterGroupItem {
        private String groupId;
        private String label;
        private String description;
        private int count;
        private List<String> reviewIds;
        private List<String> representativeExamples;

        public ClusterGroupItem() {}

        public String getGroupId() {
            return groupId;
        }

        public void setGroupId(String groupId) {
            this.groupId = groupId;
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

        public int getCount() {
            return count;
        }

        public void setCount(int count) {
            this.count = count;
        }

        public List<String> getReviewIds() {
            return reviewIds;
        }

        public void setReviewIds(List<String> reviewIds) {
            this.reviewIds = reviewIds;
        }

        public List<String> getRepresentativeExamples() {
            return representativeExamples;
        }

        public void setRepresentativeExamples(List<String> representativeExamples) {
            this.representativeExamples = representativeExamples;
        }
    }

    public static class ReviewAssignmentItem {
        private String reviewId;
        private String groupId;
        private String groupLabel;
        private Double similarityToCentroid;
        private boolean isOutlier;

        public ReviewAssignmentItem() {}

        public String getReviewId() {
            return reviewId;
        }

        public void setReviewId(String reviewId) {
            this.reviewId = reviewId;
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
            return isOutlier;
        }

        public void setOutlier(boolean outlier) {
            isOutlier = outlier;
        }
    }

    private List<ClusterGroupItem> groups;
    private List<ReviewAssignmentItem> assignments;
    private int totalClusters;
    private int ungroupedCount;

    public AiClusterResponse() {}

    public List<ClusterGroupItem> getGroups() {
        return groups;
    }

    public void setGroups(List<ClusterGroupItem> groups) {
        this.groups = groups;
    }

    public List<ReviewAssignmentItem> getAssignments() {
        return assignments;
    }

    public void setAssignments(List<ReviewAssignmentItem> assignments) {
        this.assignments = assignments;
    }

    public int getTotalClusters() {
        return totalClusters;
    }

    public void setTotalClusters(int totalClusters) {
        this.totalClusters = totalClusters;
    }

    public int getUngroupedCount() {
        return ungroupedCount;
    }

    public void setUngroupedCount(int ungroupedCount) {
        this.ungroupedCount = ungroupedCount;
    }
}
