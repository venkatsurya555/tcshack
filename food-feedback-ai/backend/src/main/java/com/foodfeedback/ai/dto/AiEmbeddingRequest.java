package com.foodfeedback.ai.dto;

import java.util.List;

public class AiEmbeddingRequest {
    private List<String> texts;

    public AiEmbeddingRequest() {}

    public AiEmbeddingRequest(List<String> texts) {
        this.texts = texts;
    }

    public List<String> getTexts() {
        return texts;
    }

    public void setTexts(List<String> texts) {
        this.texts = texts;
    }
}
