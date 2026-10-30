package com.foodfeedback.ai.service;

import com.foodfeedback.ai.dto.DashboardStatsResponse;
import com.foodfeedback.ai.dto.TrendResponse;
import com.foodfeedback.ai.model.ComplaintGroup;
import com.foodfeedback.ai.model.Review;
import com.foodfeedback.ai.repository.ReviewDataStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final ReviewDataStore dataStore;

    @Autowired
    public DashboardService(ReviewDataStore dataStore) {
        this.dataStore = dataStore;
    }

    public DashboardStatsResponse getStats() {
        List<Review> reviews = dataStore.findAllReviews();
        List<ComplaintGroup> groups = dataStore.findAllGroups();

        long totalReviews = reviews.size();
        long totalGroups = groups.stream().filter(g -> !g.isOutlierGroup()).count();

        long negativeCount = reviews.stream()
                .filter(r -> "NEGATIVE".equalsIgnoreCase(r.getSentiment()))
                .count();

        long positiveCount = reviews.stream()
                .filter(r -> "POSITIVE".equalsIgnoreCase(r.getSentiment()))
                .count();

        long neutralCount = reviews.stream()
                .filter(r -> "NEUTRAL".equalsIgnoreCase(r.getSentiment()))
                .count();

        double negativePercentage = totalReviews > 0 ? ((double) negativeCount / totalReviews) * 100.0 : 0.0;

        // Top category
        ComplaintGroup topGroup = groups.stream()
                .filter(g -> !g.isOutlierGroup())
                .max(Comparator.comparingInt(ComplaintGroup::getReviewCount))
                .orElse(null);
        String topCategoryName = topGroup != null ? topGroup.getLabel() : "None";

        // Ungrouped complaints count
        long ungroupedCount = reviews.stream()
                .filter(r -> "ungrouped".equalsIgnoreCase(r.getGroupId()) || r.isOutlier())
                .count();

        // Sentiment distribution
        Map<String, Long> sentDist = new LinkedHashMap<>();
        sentDist.put("NEGATIVE", negativeCount);
        sentDist.put("NEUTRAL", neutralCount);
        sentDist.put("POSITIVE", positiveCount);

        // Category breakdown
        List<DashboardStatsResponse.CategoryBreakdownItem> breakdown = groups.stream()
                .map(g -> {
                    double pct = totalReviews > 0 ? ((double) g.getReviewCount() / totalReviews) * 100.0 : 0.0;
                    return new DashboardStatsResponse.CategoryBreakdownItem(
                            g.getId(),
                            g.getLabel(),
                            g.getReviewCount(),
                            Math.round(pct * 10.0) / 10.0,
                            g.isOutlierGroup()
                    );
                })
                .sorted((a, b) -> {
                    if (a.isOutlier()) return 1;
                    if (b.isOutlier()) return -1;
                    return Integer.compare(b.getCount(), a.getCount());
                })
                .collect(Collectors.toList());

        DashboardStatsResponse stats = new DashboardStatsResponse();
        stats.setTotalReviews(totalReviews);
        stats.setTotalGroups((int) totalGroups);
        stats.setNegativePercentage(Math.round(negativePercentage * 10.0) / 10.0);
        stats.setMostFrequentCategory(topCategoryName);
        stats.setUngroupedCount(ungroupedCount);
        stats.setSentimentDistribution(sentDist);
        stats.setCategoryBreakdown(breakdown);

        return stats;
    }

    public List<TrendResponse> getTrends() {
        List<Review> reviews = dataStore.findAllReviews();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("MMM dd");

        Map<String, List<Review>> byDate = new TreeMap<>();
        LocalDate today = LocalDate.now();

        for (int i = 6; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            byDate.put(d.format(dtf), new ArrayList<>());
        }

        for (Review r : reviews) {
            LocalDate rDate = r.getCreatedAt() != null
                    ? LocalDate.ofInstant(r.getCreatedAt(), ZoneId.systemDefault())
                    : today;
            String key = rDate.format(dtf);
            byDate.computeIfAbsent(key, k -> new ArrayList<>()).add(r);
        }

        List<TrendResponse> trends = new ArrayList<>();
        for (Map.Entry<String, List<Review>> entry : byDate.entrySet()) {
            String dateLabel = entry.getKey();
            List<Review> dayReviews = entry.getValue();

            Map<String, Integer> catCounts = new HashMap<>();
            int total = dayReviews.size();
            int neg = 0;

            for (Review r : dayReviews) {
                String cat = r.getGroupLabel() != null ? r.getGroupLabel() : "Ungrouped";
                catCounts.put(cat, catCounts.getOrDefault(cat, 0) + 1);
                if ("NEGATIVE".equalsIgnoreCase(r.getSentiment())) {
                    neg++;
                }
            }

            trends.add(new TrendResponse(dateLabel, total, neg, catCounts));
        }

        return trends;
    }
}
