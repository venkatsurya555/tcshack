package com.foodfeedback.ai.dto;

import java.util.List;

public class AiSentimentRequest {
    private List<String> texts;

    public AiSentimentRequest() {}

    public AiSentimentRequest(List<String> texts) {
        this.texts = texts;
    }

    public List<String> getTexts() {
        return texts;
    }

    public void setTexts(List<String> texts) {
        this.texts = texts;
    }
}
