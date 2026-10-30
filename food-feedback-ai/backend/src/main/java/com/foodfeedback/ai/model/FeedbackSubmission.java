package com.foodfeedback.ai.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;

public class FeedbackSubmission {
    private Long id;
    @JsonProperty("feedback_number")
    private String feedbackNumber;
    @JsonProperty("order_id")
    private Long orderId;
    @JsonProperty("branch_id")
    private Long branchId;
    @JsonProperty("customer_name")
    private String customerName;
    @JsonProperty("customer_phone")
    private String customerPhone;
    @JsonProperty("customer_email")
    private String customerEmail;
    @JsonProperty("overall_rating")
    private Integer overallRating;
    @JsonProperty("general_comment")
    private String generalComment;
    private String channel = "QR-Web";
    @JsonProperty("created_at")
    private String createdAt;
    private List<ItemFeedback> items = new ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFeedbackNumber() { return feedbackNumber; }
    public void setFeedbackNumber(String feedbackNumber) { this.feedbackNumber = feedbackNumber; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public Long getBranchId() { return branchId; }
    public void setBranchId(Long branchId) { this.branchId = branchId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public Integer getOverallRating() { return overallRating; }
    public void setOverallRating(Integer overallRating) { this.overallRating = overallRating; }
    public String getGeneralComment() { return generalComment; }
    public void setGeneralComment(String generalComment) { this.generalComment = generalComment; }
    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public List<ItemFeedback> getItems() { return items; }
    public void setItems(List<ItemFeedback> items) { this.items = items; }
}
