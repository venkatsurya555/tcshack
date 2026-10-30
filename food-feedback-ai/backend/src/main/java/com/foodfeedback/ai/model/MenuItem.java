package com.foodfeedback.ai.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MenuItem {
    private Long id;
    @JsonProperty("branch_id")
    private Long branchId;
    private String name;
    private String category;
    private String description;
    private double price;
    @JsonProperty("is_available")
    private boolean isAvailable = true;
    @JsonProperty("image_url")
    private String imageUrl;
    @JsonProperty("created_at")
    private String createdAt;
    @JsonProperty("average_rating")
    private Double averageRating = 4.5;
    @JsonProperty("total_feedbacks")
    private Integer totalFeedbacks = 12;
    @JsonProperty("total_complaints")
    private Integer totalComplaints = 0;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getBranchId() { return branchId; }
    public void setBranchId(Long branchId) { this.branchId = branchId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { isAvailable = available; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }
    public Integer getTotalFeedbacks() { return totalFeedbacks; }
    public void setTotalFeedbacks(Integer totalFeedbacks) { this.totalFeedbacks = totalFeedbacks; }
    public Integer getTotalComplaints() { return totalComplaints; }
    public void setTotalComplaints(Integer totalComplaints) { this.totalComplaints = totalComplaints; }
}
