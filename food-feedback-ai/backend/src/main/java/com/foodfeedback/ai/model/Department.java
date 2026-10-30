package com.foodfeedback.ai.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Department {
    private Long id;
    private String code;
    private String name;
    private String description;
    @JsonProperty("sla_hours")
    private int slaHours = 2;
    @JsonProperty("is_active")
    private boolean isActive = true;
    @JsonProperty("created_at")
    private String createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public int getSlaHours() { return slaHours; }
    public void setSlaHours(int slaHours) { this.slaHours = slaHours; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
