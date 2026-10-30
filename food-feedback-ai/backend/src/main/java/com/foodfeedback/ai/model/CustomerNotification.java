package com.foodfeedback.ai.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CustomerNotification {
    private Long id;
    @JsonProperty("ticket_id")
    private Long ticketId;
    @JsonProperty("ticket_number")
    private String ticketNumber;
    @JsonProperty("customer_name")
    private String customerName;
    @JsonProperty("customer_phone")
    private String customerPhone;
    @JsonProperty("customer_email")
    private String customerEmail;
    @JsonProperty("event_type")
    private String eventType;
    private String title;
    private String message;
    private String channel = "In-App Demo";
    @JsonProperty("is_read")
    private boolean isRead = false;
    @JsonProperty("delivery_status")
    private String deliveryStatus = "Delivered";
    @JsonProperty("created_at")
    private String createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getTicketId() { return ticketId; }
    public void setTicketId(Long ticketId) { this.ticketId = ticketId; }
    public String getTicketNumber() { return ticketNumber; }
    public void setTicketNumber(String ticketNumber) { this.ticketNumber = ticketNumber; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }
    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }
    public String getDeliveryStatus() { return deliveryStatus; }
    public void setDeliveryStatus(String deliveryStatus) { this.deliveryStatus = deliveryStatus; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
