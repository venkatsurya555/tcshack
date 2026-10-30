package com.foodfeedback.ai.service.nlp;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Pure Java Explainable Topic and Category Labeling Engine.
 * 100% Native Java implementation matching and exceeding Python labeling service.
 */
@Service
public class NativeLabelingService {

    public static class LabelResult {
        private final String label;
        private final String description;
        private final List<String> topKeywords;

        public LabelResult(String label, String description, List<String> topKeywords) {
            this.label = label;
            this.description = description;
            this.topKeywords = topKeywords;
        }

        public String getLabel() {
            return label;
        }

        public String getDescription() {
            return description;
        }

        public List<String> getTopKeywords() {
            return topKeywords;
        }
    }

    private static class ThemeMeta {
        final List<String> keywords;
        final String description;

        ThemeMeta(List<String> keywords, String description) {
            this.keywords = keywords;
            this.description = description;
        }
    }

    private final Map<String, ThemeMeta> canonicalThemes = new LinkedHashMap<>();

    private static final Set<String> STOP_WORDS = Set.of(
            "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of",
            "with", "by", "from", "up", "about", "into", "through", "after", "is", "was",
            "are", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did",
            "i", "we", "my", "our", "you", "your", "they", "their", "it", "its", "this", "that",
            "food", "restaurant", "order", "ordered", "meal", "very", "really", "so", "just"
    );

    private static final Pattern TOKEN_PATTERN = Pattern.compile("\\b[a-zA-Z]{3,}\\b");

    public NativeLabelingService() {
        canonicalThemes.put("Slow Service / Long Waiting Time", new ThemeMeta(
                List.of("wait", "waited", "waiting", "slow", "delay", "delayed", "minutes", "hour", "hours", "late", "took so long", "forever", "time"),
                "Complaints regarding extended wait times, delayed preparation, or slow order delivery."
        ));
        canonicalThemes.put("Food Temperature Issues", new ThemeMeta(
                List.of("cold", "lukewarm", "not hot", "freezing", "chilly", "warm", "reheated", "temperature", "microwaved", "frozen"),
                "Issues concerning meals served below expected temperature or lukewarm dishes."
        ));
        canonicalThemes.put("Food Quality & Taste", new ThemeMeta(
                List.of("salty", "bland", "overcooked", "burnt", "dry", "undercooked", "raw", "tasteless", "stale", "flavorless", "rubbery", "greasy", "oily", "soggy", "quality", "taste"),
                "Dissatisfaction with flavor, seasoning, freshness, texture, or cooking execution."
        ));
        canonicalThemes.put("Hygiene and Cleanliness", new ThemeMeta(
                List.of("hair", "fly", "insect", "bug", "dirty", "unclean", "smell", "sanitation", "filthy", "stain", "cockroach", "washroom", "cleanliness", "hygiene"),
                "Concerns regarding foreign objects in food, dirty utensils, or facility sanitation."
        ));
        canonicalThemes.put("Pricing and Billing", new ThemeMeta(
                List.of("expensive", "overpriced", "bill", "charged", "overcharge", "rip-off", "hidden", "fee", "receipt", "price", "cost", "money"),
                "Complaints regarding incorrect billing, hidden surcharges, or poor value for price."
        ));
        canonicalThemes.put("Staff Behaviour", new ThemeMeta(
                List.of("rude", "impolite", "attitude", "unfriendly", "ignored", "server", "waiter", "staff", "manager", "disrespectful", "hostile", "unprofessional"),
                "Negative interactions with waitstaff, cashiers, or restaurant management."
        ));
        canonicalThemes.put("Delivery & Packaging", new ThemeMeta(
                List.of("spilled", "leaked", "packaging", "courier", "driver", "crushed", "squashed", "wrong item", "missing item", "seal", "container", "delivery"),
                "Delivery logistics issues, spilled food containers, or damaged order packaging."
        ));
        canonicalThemes.put("Portion Size", new ThemeMeta(
                List.of("small", "tiny", "portion", "size", "little", "scanty", "hardly", "barely", "skimp", "amount"),
                "Feedback regarding underwhelming portions or shrinking serving sizes."
        ));
        canonicalThemes.put("Positive Feedback", new ThemeMeta(
                List.of("delicious", "amazing", "great", "excellent", "loved", "perfect", "fresh", "friendly", "fantastic", "wonderful", "best", "recommend"),
                "Compliments and positive reviews celebrating food taste, ambiance, or service excellence."
        ));
    }

    public List<String> extractKeywords(List<String> texts, int topK) {
        if (texts == null || texts.isEmpty()) {
            return Collections.emptyList();
        }
        Map<String, Integer> counts = new HashMap<>();
        for (String text : texts) {
            if (text == null) continue;
            Matcher m = TOKEN_PATTERN.matcher(text.toLowerCase());
            while (m.find()) {
                String tok = m.group();
                if (!STOP_WORDS.contains(tok)) {
                    counts.put(tok, counts.getOrDefault(tok, 0) + 1);
                }
            }
        }

        return counts.entrySet().stream()
                .sorted((a, b) -> Integer.compare(b.getValue(), a.getValue()))
                .limit(topK)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    public LabelResult labelCluster(int clusterId, List<String> reviewTexts) {
        if (clusterId == -1 || reviewTexts == null || reviewTexts.isEmpty()) {
            return new LabelResult(
                    "Ungrouped / Other",
                    "Distinct reviews that do not fit standard semantic complaint patterns or share high similarity with other clusters.",
                    extractKeywords(reviewTexts, 5)
            );
        }

        String combinedText = String.join(" ", reviewTexts).toLowerCase();
        String bestCategory = null;
        int bestScore = -1;

        for (Map.Entry<String, ThemeMeta> entry : canonicalThemes.entrySet()) {
            String category = entry.getKey();
            ThemeMeta meta = entry.getValue();

            int score = 0;
            for (String kw : meta.keywords) {
                if (kw.contains(" ")) {
                    if (combinedText.contains(kw)) {
                        score += 3;
                    }
                } else {
                    Pattern p = Pattern.compile("\\b" + Pattern.quote(kw) + "\\b");
                    Matcher m = p.matcher(combinedText);
                    int count = 0;
                    while (m.find()) {
                        count++;
                    }
                    score += count * 2;
                }
            }

            if (score > bestScore) {
                bestScore = score;
                bestCategory = category;
            }
        }

        List<String> topKw = extractKeywords(reviewTexts, 5);
        String label;
        String description;

        if (bestScore > 0 && bestCategory != null) {
            label = bestCategory;
            description = canonicalThemes.get(bestCategory).description;
        } else {
            if (!topKw.isEmpty()) {
                String kws = topKw.stream().limit(2).map(k -> Character.toUpperCase(k.charAt(0)) + k.substring(1)).collect(Collectors.joining(", "));
                label = "Issue with " + kws;
                description = "Complaints frequently mentioning: " + String.join(", ", topKw) + ".";
            } else {
                label = "Complaint Cluster #" + clusterId;
                description = "Group of semantically similar customer complaints.";
            }
        }

        return new LabelResult(label, description, topKw);
    }
}
