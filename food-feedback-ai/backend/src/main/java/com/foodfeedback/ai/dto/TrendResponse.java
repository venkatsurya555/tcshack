package com.foodfeedback.ai.dto;

import java.util.HashMap;
import java.util.Map;

public class TrendResponse {
    private String date;
    private int totalComplaints;
    private int negativeComplaints;
    private Map<String, Integer> categoryCounts = new HashMap<>();

    public TrendResponse() {}

    public TrendResponse(String date, int totalComplaints, int negativeComplaints, Map<String, Integer> categoryCounts) {
        this.date = date;
        this.totalComplaints = totalComplaints;
        this.negativeComplaints = negativeComplaints;
        this.categoryCounts = categoryCounts;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public int getTotalComplaints() {
        return totalComplaints;
    }

    public void setTotalComplaints(int totalComplaints) {
        this.totalComplaints = totalComplaints;
    }

    public int getNegativeComplaints() {
        return negativeComplaints;
    }

    public void setNegativeComplaints(int negativeComplaints) {
        this.negativeComplaints = negativeComplaints;
    }

    public Map<String, Integer> getCategoryCounts() {
        return categoryCounts;
    }

    public void setCategoryCounts(Map<String, Integer> categoryCounts) {
        this.categoryCounts = categoryCounts;
    }
}
