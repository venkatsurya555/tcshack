package com.foodfeedback.ai.service;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class TrendDetectionService {

    private static final DateTimeFormatter ISO_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Calculates the percentage rate of change:
     * Trend (%) = ((current - baseline) / baseline) * 100
     */
    public double calculateTrendPercentage(double baseline, double current) {
        if (baseline <= 0.0) {
            return current > 0.0 ? 100.0 : 0.0;
        }
        return ((current - baseline) / baseline) * 100.0;
    }

    /**
     * Normalizes a trend percentage into a [0, 100] score for priority weighting.
     * 0% growth -> 50.0 (neutral)
     * +100% growth -> 75.0
     * +200% growth -> 100.0
     * -100% decline -> 0.0
     */
    public double normalizeTrendToScore(double trendPercentage) {
        double score = 50.0 + (trendPercentage * 0.25);
        return Math.max(0.0, Math.min(100.0, score));
    }

    /**
     * Aggregates date-stamped records into daily totals, safely handling missing timestamps.
     */
    public Map<String, Integer> aggregateDailyCounts(List<String> dateStrings) {
        Map<String, Integer> counts = new TreeMap<>();
        DateTimeFormatter outFmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate today = LocalDate.now();

        for (String ds : dateStrings) {
            String key;
            if (ds == null || ds.trim().isEmpty()) {
                key = today.format(outFmt);
            } else {
                try {
                    String clean = ds.replace('T', ' ');
                    if (clean.length() > 19) clean = clean.substring(0, 19);
                    LocalDateTime dt = LocalDateTime.parse(clean, ISO_FMT);
                    key = dt.toLocalDate().format(outFmt);
                } catch (Exception e) {
                    key = today.format(outFmt);
                }
            }
            counts.put(key, counts.getOrDefault(key, 0) + 1);
        }
        return counts;
    }
}
