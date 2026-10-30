package com.foodfeedback.ai.dto;

import java.util.List;

public class AiSentimentResponse {

    public static class SentimentItem {
        private String sentiment; // POSITIVE, NEGATIVE, NEUTRAL
        private double confidence;

        public SentimentItem() {}

        public SentimentItem(String sentiment, double confidence) {
            this.sentiment = sentiment;
            this.confidence = confidence;
        }

        public String getSentiment() {
            return sentiment;
        }

        public void setSentiment(String sentiment) {
            this.sentiment = sentiment;
        }

        public double getConfidence() {
            return confidence;
        }

        public void setConfidence(double confidence) {
            this.confidence = confidence;
        }
    }

    private List<SentimentItem> results;

    public AiSentimentResponse() {}

    public List<SentimentItem> getResults() {
        return results;
    }

    public void setResults(List<SentimentItem> results) {
        this.results = results;
    }
}
