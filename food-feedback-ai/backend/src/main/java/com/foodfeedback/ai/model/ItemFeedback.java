package com.foodfeedback.ai.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ItemFeedback {
    private Long id;
    @JsonProperty("submission_id")
    private Long submissionId;
    @JsonProperty("order_item_id")
    private Long orderItemId;
    @JsonProperty("item_name")
    private String itemName;
    private int rating;
    @JsonProperty("issue_category")
    private String issueCategory;
    @JsonProperty("follow_up_response")
    private String followUpResponse;
    private String comment;
    @JsonProperty("created_at")
    private String createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getSubmissionId() { return submissionId; }
    public void setSubmissionId(Long submissionId) { this.submissionId = submissionId; }
    public Long getOrderItemId() { return orderItemId; }
    public void setOrderItemId(Long orderItemId) { this.orderItemId = orderItemId; }
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getIssueCategory() { return issueCategory; }
    public void setIssueCategory(String issueCategory) { this.issueCategory = issueCategory; }
    public String getFollowUpResponse() { return followUpResponse; }
    public void setFollowUpResponse(String followUpResponse) { this.followUpResponse = followUpResponse; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
