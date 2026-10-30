package com.foodfeedback.ai.service.nlp;

import com.foodfeedback.ai.dto.AiSentimentResponse;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Pure Java High-Fidelity Sentiment Analysis Engine.
 * 100% Native Java implementation replacing Python sentiment microservice.
 */
@Service
public class NativeSentimentService {

    private static final Set<String> NEGATIVE_WORDS = Set.of(
            "horrible", "terrible", "awful", "bad", "disgusting", "poor", "rude", "cold",
            "stale", "slow", "dirty", "unclean", "raw", "undercooked", "overcooked", "burnt",
            "bland", "salty", "worst", "unacceptable", "delay", "delayed", "late", "refused",
            "spilled", "ruined", "sick", "hair", "insect", "bug", "roach", "expensive",
            "overpriced", "disappointed", "disappointing", "waste", "never", "hate", "unfriendly",
            "hostile", "ignored", "freezing", "lukewarm", "rip-off", "complaint", "dry", "tasteless",
            "spoiled", "spoil", "inedible", "oversalted", "scanty", "small", "tiny", "greasy",
            "oily", "soggy", "excessive", "unpleasant", "contamination", "contaminated"
    );

    private static final Set<String> POSITIVE_WORDS = Set.of(
            "great", "excellent", "amazing", "wonderful", "fantastic", "delicious", "tasty",
            "fresh", "loved", "friendly", "helpful", "polite", "quick", "fast", "hot", "warm",
            "perfect", "best", "clean", "spotless", "crispy", "flavorful", "satisfying",
            "generous", "reasonable", "recommend", "recommended", "pleased", "enjoyed", "courteous",
            "yum", "yummy", "divine", "heavenly", "superb"
    );

    private static final List<String> NEGATIVE_PHRASES = List.of(
            "too much salt", "too salty", "too spicy", "too sweet", "too cold", "too slow",
            "too small", "not fresh", "not hot", "not clean", "not good", "tastes bad",
            "bad taste", "served cold", "cold food", "long wait", "took too long", "freezing cold",
            "ice cold", "not enough", "poor service", "small quantity", "small portion"
    );

    private static final Map<String, Double> INTENSIFIERS = Map.of(
            "very", 1.4,
            "extremely", 1.8,
            "incredibly", 1.8,
            "really", 1.3,
            "super", 1.4,
            "totally", 1.4,
            "absolutely", 1.6,
            "completely", 1.5,
            "excessively", 1.7
    );

    private static final Set<String> CONTRASTIVE_CONJUNCTIONS = Set.of(
            "but", "however", "although", "yet", "though", "except"
    );

    private static final Set<String> NEGATIONS = Set.of(
            "not", "never", "no", "n't", "hardly", "barely", "scarcely", "without"
    );

    private static final Pattern WORD_PATTERN = Pattern.compile("\\b[a-zA-Z']+\\b");

    public AiSentimentResponse.SentimentItem analyzeSentiment(String text) {
        if (text == null || text.trim().isEmpty()) {
            return new AiSentimentResponse.SentimentItem("NEUTRAL", 0.50);
        }

        String cleanText = text.toLowerCase().trim();
        List<String> words = new ArrayList<>();
        Matcher matcher = WORD_PATTERN.matcher(cleanText);
        while (matcher.find()) {
            words.add(matcher.group());
        }

        double posScore = 0.0;
        double negScore = 0.0;
        boolean negated = false;
        double clauseWeight = 1.0;

        // 1. Check multi-word negative phrases
        for (String phrase : NEGATIVE_PHRASES) {
            if (cleanText.contains(phrase)) {
                negScore += 1.8;
            }
        }

        // 2. Scan words with context
        for (int i = 0; i < words.size(); i++) {
            String word = words.get(i);

            // Check contrastive transition
            if (CONTRASTIVE_CONJUNCTIONS.contains(word)) {
                clauseWeight = 1.6; // Shift focal emphasis to the post-contrast clause
                negated = false;
                continue;
            }

            if (NEGATIONS.contains(word) || word.endsWith("n't")) {
                negated = true;
                continue;
            }

            double weight = clauseWeight;
            if (i > 0 && INTENSIFIERS.containsKey(words.get(i - 1))) {
                weight *= INTENSIFIERS.get(words.get(i - 1));
            }

            boolean isPos = POSITIVE_WORDS.contains(word);
            boolean isNeg = NEGATIVE_WORDS.contains(word);

            if (isPos) {
                if (negated) {
                    negScore += 1.3 * weight;
                } else {
                    posScore += 1.0 * weight;
                }
                negated = false;
            } else if (isNeg) {
                if (negated) {
                    posScore += 0.8 * weight;
                } else {
                    negScore += 1.3 * weight;
                }
                negated = false;
            } else {
                if (negated && i > 2) {
                    negated = false;
                }
            }
        }

        double netScore = posScore - negScore;
        double totalMagnitude = posScore + negScore;

        if (totalMagnitude == 0.0) {
            return new AiSentimentResponse.SentimentItem("NEUTRAL", 0.65);
        }

        double normalizedPolarity = Math.max(-1.0, Math.min(1.0, netScore / Math.max(1.0, totalMagnitude)));
        String sentiment;
        double confidence;

        if (normalizedPolarity <= -0.10) {
            sentiment = "NEGATIVE";
            confidence = Math.min(0.99, Math.max(0.60, 0.55 + Math.abs(normalizedPolarity) * 0.40));
        } else if (normalizedPolarity >= 0.10) {
            sentiment = "POSITIVE";
            confidence = Math.min(0.99, Math.max(0.60, 0.55 + normalizedPolarity * 0.40));
        } else {
            sentiment = "NEUTRAL";
            confidence = Math.min(0.90, Math.max(0.55, 0.75 - Math.abs(normalizedPolarity)));
        }

        return new AiSentimentResponse.SentimentItem(sentiment, Math.round(confidence * 1000.0) / 1000.0);
    }

    public List<AiSentimentResponse.SentimentItem> analyzeBatch(List<String> texts) {
        if (texts == null || texts.isEmpty()) {
            return Collections.emptyList();
        }
        List<AiSentimentResponse.SentimentItem> results = new ArrayList<>(texts.size());
        for (String text : texts) {
            results.add(analyzeSentiment(text));
        }
        return results;
    }

    public AiSentimentResponse getSentimentResponse(List<String> texts) {
        AiSentimentResponse response = new AiSentimentResponse();
        response.setResults(analyzeBatch(texts));
        return response;
    }
}
