package com.foodfeedback.ai.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PriorityScoringService {

    public static final double SEVERITY_WEIGHT = 0.4;
    public static final double FREQUENCY_WEIGHT = 0.3;
    public static final double TREND_WEIGHT = 0.3;

    public static class PriorityResult {
        private final double totalScore;
        private final double severityContribution;
        private final double frequencyContribution;
        private final double trendContribution;
        private final String priorityLevel;

        public PriorityResult(double totalScore, double severityContribution, double frequencyContribution, double trendContribution, String priorityLevel) {
            this.totalScore = totalScore;
            this.severityContribution = severityContribution;
            this.frequencyContribution = frequencyContribution;
            this.trendContribution = trendContribution;
            this.priorityLevel = priorityLevel;
        }

        public double getTotalScore() { return totalScore; }
        public double getSeverityContribution() { return severityContribution; }
        public double getFrequencyContribution() { return frequencyContribution; }
        public double getTrendContribution() { return trendContribution; }
        public String getPriorityLevel() { return priorityLevel; }

        public Map<String, Object> toMap() {
            Map<String, Object> map = new HashMap<>();
            map.put("total_score", Math.round(totalScore * 10.0) / 10.0);
            map.put("severity_contribution", Math.round(severityContribution * 10.0) / 10.0);
            map.put("frequency_contribution", Math.round(frequencyContribution * 10.0) / 10.0);
            map.put("trend_contribution", Math.round(trendContribution * 10.0) / 10.0);
            map.put("priority_level", priorityLevel);
            return map;
        }
    }

    /**
     * Calculates Priority based on the exact weighted formula:
     * Priority = (0.4 * Severity) + (0.3 * Frequency) + (0.3 * Trend)
     * All inputs normalized to [0, 100].
     */
    public PriorityResult calculatePriority(Double severity, Double frequency, Double trend) {
        double safeSev = clamp(severity != null ? severity : 50.0, 0.0, 100.0);
        double safeFreq = clamp(frequency != null ? frequency : 50.0, 0.0, 100.0);
        double safeTrend = clamp(trend != null ? trend : 50.0, 0.0, 100.0);

        double sevContrib = SEVERITY_WEIGHT * safeSev;
        double freqContrib = FREQUENCY_WEIGHT * safeFreq;
        double trendContrib = TREND_WEIGHT * safeTrend;

        double totalScore = sevContrib + freqContrib + trendContrib;
        totalScore = clamp(totalScore, 0.0, 100.0);

        String level = determineLevel(totalScore);

        return new PriorityResult(totalScore, sevContrib, freqContrib, trendContrib, level);
    }

    public String determineLevel(double score) {
        if (score >= 75.0) return "Critical";
        if (score >= 55.0) return "High";
        if (score >= 35.0) return "Medium";
        return "Low";
    }

    private double clamp(double val, double min, double max) {
        return Math.max(min, Math.min(max, val));
    }
}
