package com.foodfeedback.ai.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;

public class ComplaintTicket {
    private Long id;
    @JsonProperty("ticket_number")
    private String ticketNumber;
    @JsonProperty("order_id")
    private Long orderId;
    @JsonProperty("order_number")
    private String orderNumber;
    @JsonProperty("feedback_submission_id")
    private Long feedbackSubmissionId;
    @JsonProperty("item_feedback_id")
    private Long itemFeedbackId;
    @JsonProperty("branch_id")
    private Long branchId;
    @JsonProperty("branch_name")
    private String branchName;
    @JsonProperty("department_id")
    private Long departmentId;
    @JsonProperty("department_name")
    private String departmentName;
    @JsonProperty("department_code")
    private String departmentCode;
    @JsonProperty("assigned_staff_id")
    private Long assignedStaffId;
    @JsonProperty("assigned_staff_name")
    private String assignedStaffName;
    @JsonProperty("item_name")
    private String itemName;
    @JsonProperty("issue_category")
    private String issueCategory;
    private String priority = "Medium";
    @JsonProperty("priority_score")
    private Double priorityScore = 60.0;
    @JsonProperty("severity_score")
    private Double severityScore = 50.0;
    @JsonProperty("frequency_score")
    private Double frequencyScore = 70.0;
    @JsonProperty("trend_score")
    private Double trendScore = 60.0;
    private String status = "Open";
    @JsonProperty("customer_name")
    private String customerName;
    @JsonProperty("customer_phone")
    private String customerPhone;
    @JsonProperty("customer_comment")
    private String customerComment;
    @JsonProperty("sla_deadline")
    private String slaDeadline;
    @JsonProperty("is_overdue")
    private boolean isOverdue = false;
    @JsonProperty("time_elapsed_minutes")
    private int timeElapsedMinutes = 0;
    @JsonProperty("acknowledged_at")
    private String acknowledgedAt;
    @JsonProperty("resolved_at")
    private String resolvedAt;
    @JsonProperty("verified_at")
    private String verifiedAt;
    @JsonProperty("verified_by_user_id")
    private Long verifiedByUserId;
    @JsonProperty("verified_by_name")
    private String verifiedByName;
    @JsonProperty("root_cause")
    private String rootCause;
    @JsonProperty("corrective_action")
    private String correctiveAction;
    @JsonProperty("preventive_action")
    private String preventiveAction;
    @JsonProperty("reassignment_reason")
    private String reassignmentReason;
    @JsonProperty("reopen_reason")
    private String reopenReason;
    @JsonProperty("customer_satisfaction_score")
    private Integer customerSatisfactionScore;
    @JsonProperty("customer_satisfaction_comment")
    private String customerSatisfactionComment;
    @JsonProperty("created_at")
    private String createdAt;
    @JsonProperty("updated_at")
    private String updatedAt;

    @JsonProperty("status_history")
    private List<TicketStatusHistory> statusHistory = new ArrayList<>();
    @JsonProperty("investigation_notes")
    private List<InvestigationNote> investigationNotes = new ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTicketNumber() { return ticketNumber; }
    public void setTicketNumber(String ticketNumber) { this.ticketNumber = ticketNumber; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    public Long getFeedbackSubmissionId() { return feedbackSubmissionId; }
    public void setFeedbackSubmissionId(Long feedbackSubmissionId) { this.feedbackSubmissionId = feedbackSubmissionId; }
    public Long getItemFeedbackId() { return itemFeedbackId; }
    public void setItemFeedbackId(Long itemFeedbackId) { this.itemFeedbackId = itemFeedbackId; }
    public Long getBranchId() { return branchId; }
    public void setBranchId(Long branchId) { this.branchId = branchId; }
    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }
    public Long getAssignedStaffId() { return assignedStaffId; }
    public void setAssignedStaffId(Long assignedStaffId) { this.assignedStaffId = assignedStaffId; }
    public String getAssignedStaffName() { return assignedStaffName; }
    public void setAssignedStaffName(String assignedStaffName) { this.assignedStaffName = assignedStaffName; }
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    public String getIssueCategory() { return issueCategory; }
    public void setIssueCategory(String issueCategory) { this.issueCategory = issueCategory; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public Double getPriorityScore() { return priorityScore; }
    public void setPriorityScore(Double priorityScore) { this.priorityScore = priorityScore; }
    public Double getSeverityScore() { return severityScore; }
    public void setSeverityScore(Double severityScore) { this.severityScore = severityScore; }
    public Double getFrequencyScore() { return frequencyScore; }
    public void setFrequencyScore(Double frequencyScore) { this.frequencyScore = frequencyScore; }
    public Double getTrendScore() { return trendScore; }
    public void setTrendScore(Double trendScore) { this.trendScore = trendScore; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
    public String getCustomerComment() { return customerComment; }
    public void setCustomerComment(String customerComment) { this.customerComment = customerComment; }
    public String getSlaDeadline() { return slaDeadline; }
    public void setSlaDeadline(String slaDeadline) { this.slaDeadline = slaDeadline; }
    public boolean isOverdue() { return isOverdue; }
    public void setOverdue(boolean overdue) { isOverdue = overdue; }
    public int getTimeElapsedMinutes() { return timeElapsedMinutes; }
    public void setTimeElapsedMinutes(int timeElapsedMinutes) { this.timeElapsedMinutes = timeElapsedMinutes; }
    public String getAcknowledgedAt() { return acknowledgedAt; }
    public void setAcknowledgedAt(String acknowledgedAt) { this.acknowledgedAt = acknowledgedAt; }
    public String getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(String resolvedAt) { this.resolvedAt = resolvedAt; }
    public String getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(String verifiedAt) { this.verifiedAt = verifiedAt; }
    public Long getVerifiedByUserId() { return verifiedByUserId; }
    public void setVerifiedByUserId(Long verifiedByUserId) { this.verifiedByUserId = verifiedByUserId; }
    public String getVerifiedByName() { return verifiedByName; }
    public void setVerifiedByName(String verifiedByName) { this.verifiedByName = verifiedByName; }
    public String getRootCause() { return rootCause; }
    public void setRootCause(String rootCause) { this.rootCause = rootCause; }
    public String getCorrectiveAction() { return correctiveAction; }
    public void setCorrectiveAction(String correctiveAction) { this.correctiveAction = correctiveAction; }
    public String getPreventiveAction() { return preventiveAction; }
    public void setPreventiveAction(String preventiveAction) { this.preventiveAction = preventiveAction; }
    public String getReassignmentReason() { return reassignmentReason; }
    public void setReassignmentReason(String reassignmentReason) { this.reassignmentReason = reassignmentReason; }
    public String getReopenReason() { return reopenReason; }
    public void setReopenReason(String reopenReason) { this.reopenReason = reopenReason; }
    public Integer getCustomerSatisfactionScore() { return customerSatisfactionScore; }
    public void setCustomerSatisfactionScore(Integer customerSatisfactionScore) { this.customerSatisfactionScore = customerSatisfactionScore; }
    public String getCustomerSatisfactionComment() { return customerSatisfactionComment; }
    public void setCustomerSatisfactionComment(String customerSatisfactionComment) { this.customerSatisfactionComment = customerSatisfactionComment; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
    public List<TicketStatusHistory> getStatusHistory() { return statusHistory; }
    public void setStatusHistory(List<TicketStatusHistory> statusHistory) { this.statusHistory = statusHistory; }
    public List<InvestigationNote> getInvestigationNotes() { return investigationNotes; }
    public void setInvestigationNotes(List<InvestigationNote> investigationNotes) { this.investigationNotes = investigationNotes; }
}
