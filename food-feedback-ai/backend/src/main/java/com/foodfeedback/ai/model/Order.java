package com.foodfeedback.ai.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;

public class Order {
    private Long id;
    @JsonProperty("order_number")
    private String orderNumber;
    @JsonProperty("branch_id")
    private Long branchId;
    @JsonProperty("branch_name")
    private String branchName;
    @JsonProperty("customer_id")
    private Long customerId;
    @JsonProperty("customer_name")
    private String customerName;
    @JsonProperty("customer_phone")
    private String customerPhone;
    @JsonProperty("customer_email")
    private String customerEmail;
    @JsonProperty("table_number")
    private String tableNumber;
    @JsonProperty("order_channel")
    private String orderChannel = "Dine-In";
    @JsonProperty("bill_total")
    private double billTotal;
    private String status = "Completed";
    @JsonProperty("feedback_submitted")
    private boolean feedbackSubmitted = false;
    @JsonProperty("created_at")
    private String createdAt;
    private List<OrderItem> items = new ArrayList<>();
    @JsonProperty("qr_token")
    private String qrToken;
    @JsonProperty("qr_status")
    private String qrStatus;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    public Long getBranchId() { return branchId; }
    public void setBranchId(Long branchId) { this.branchId = branchId; }
    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public String getTableNumber() { return tableNumber; }
    public void setTableNumber(String tableNumber) { this.tableNumber = tableNumber; }
    public String getOrderChannel() { return orderChannel; }
    public void setOrderChannel(String orderChannel) { this.orderChannel = orderChannel; }
    public double getBillTotal() { return billTotal; }
    public void setBillTotal(double billTotal) { this.billTotal = billTotal; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public boolean isFeedbackSubmitted() { return feedbackSubmitted; }
    public void setFeedbackSubmitted(boolean feedbackSubmitted) { this.feedbackSubmitted = feedbackSubmitted; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
    public String getQrToken() { return qrToken; }
    public void setQrToken(String qrToken) { this.qrToken = qrToken; }
    public String getQrStatus() { return qrStatus; }
    public void setQrStatus(String qrStatus) { this.qrStatus = qrStatus; }
}
