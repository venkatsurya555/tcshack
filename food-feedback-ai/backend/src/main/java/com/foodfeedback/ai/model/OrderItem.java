package com.foodfeedback.ai.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class OrderItem {
    private Long id;
    @JsonProperty("order_id")
    private Long orderId;
    @JsonProperty("menu_item_id")
    private Long menuItemId;
    @JsonProperty("item_name")
    private String itemName;
    private int quantity = 1;
    @JsonProperty("price_each")
    private double priceEach;
    private double subtotal;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public Long getMenuItemId() { return menuItemId; }
    public void setMenuItemId(Long menuItemId) { this.menuItemId = menuItemId; }
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public double getPriceEach() { return priceEach; }
    public void setPriceEach(double priceEach) { this.priceEach = priceEach; }
    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }
}
