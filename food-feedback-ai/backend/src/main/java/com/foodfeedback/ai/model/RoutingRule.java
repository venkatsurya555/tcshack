package com.foodfeedback.ai.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RoutingRule {
    private Long id;
    @JsonProperty("issue_category")
    private String issueCategory;
    @JsonProperty("department_id")
    private Long departmentId;
    @JsonProperty("department_name")
    private String departmentName;
    @JsonProperty("department_code")
    private String departmentCode;
    @JsonProperty("default_priority")
    private String defaultPriority = "Medium";
    @JsonProperty("sla_hours")
    private int slaHours = 2;
    @JsonProperty("is_active")
    private boolean isActive = true;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getIssueCategory() { return issueCategory; }
    public void setIssueCategory(String issueCategory) { this.issueCategory = issueCategory; }
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }
    public String getDefaultPriority() { return defaultPriority; }
    public void setDefaultPriority(String defaultPriority) { this.defaultPriority = defaultPriority; }
    public int getSlaHours() { return slaHours; }
    public void setSlaHours(int slaHours) { this.slaHours = slaHours; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}
