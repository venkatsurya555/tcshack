package com.foodfeedback.ai.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class QRToken {
    private Long id;
    private String token;
    @JsonProperty("order_id")
    private Long orderId;
    @JsonProperty("order_number")
    private String orderNumber;
    @JsonProperty("branch_id")
    private Long branchId;
    @JsonProperty("branch_name")
    private String branchName;
    private String status = "active";
    @JsonProperty("expires_at")
    private String expiresAt;
    @JsonProperty("used_at")
    private String usedAt;
    @JsonProperty("feedback_url")
    private String feedbackUrl;
    @JsonProperty("qr_code_image")
    private String qrCodeImage;
    @JsonProperty("created_at")
    private String createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    public Long getBranchId() { return branchId; }
    public void setBranchId(Long branchId) { this.branchId = branchId; }
    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getExpiresAt() { return expiresAt; }
    public void setExpiresAt(String expiresAt) { this.expiresAt = expiresAt; }
    public String getUsedAt() { return usedAt; }
    public void setUsedAt(String usedAt) { this.usedAt = usedAt; }
    public String getFeedbackUrl() { return feedbackUrl; }
    public void setFeedbackUrl(String feedbackUrl) { this.feedbackUrl = feedbackUrl; }
    public String getQrCodeImage() { return qrCodeImage; }
    public void setQrCodeImage(String qrCodeImage) { this.qrCodeImage = qrCodeImage; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
