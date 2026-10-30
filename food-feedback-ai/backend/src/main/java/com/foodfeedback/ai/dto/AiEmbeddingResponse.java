package com.foodfeedback.ai.dto;

import java.util.List;

public class AiEmbeddingResponse {
    private List<List<Double>> embeddings;
    private int dimension;
    private String model;

    public AiEmbeddingResponse() {}

    public List<List<Double>> getEmbeddings() {
        return embeddings;
    }

    public void setEmbeddings(List<List<Double>> embeddings) {
        this.embeddings = embeddings;
    }

    public int getDimension() {
        return dimension;
    }

    public void setDimension(int dimension) {
        this.dimension = dimension;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }
}
