package com.foodfeedback.ai.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserAccount {
    private Long id;
    private String username;
    private String email;
    @JsonProperty("hashed_password")
    private String hashedPassword;
    @JsonProperty("full_name")
    private String fullName;
    private String role;
    @JsonProperty("department_id")
    private Long departmentId;
    @JsonProperty("department_name")
    private String departmentName;
    @JsonProperty("branch_id")
    private Long branchId;
    @JsonProperty("branch_name")
    private String branchName;
    private String phone;
    @JsonProperty("is_active")
    private boolean isActive = true;
    @JsonProperty("created_at")
    private String createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getHashedPassword() { return hashedPassword; }
    public void setHashedPassword(String hashedPassword) { this.hashedPassword = hashedPassword; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public Long getBranchId() { return branchId; }
    public void setBranchId(Long branchId) { this.branchId = branchId; }
    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
