package com.foodfeedback.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ReviewRequest {

    @NotBlank(message = "Review text must not be empty")
    @Size(min = 3, max = 2000, message = "Review text must be between 3 and 2000 characters")
    private String text;

    private String source = "MANUAL_INPUT";

    public ReviewRequest() {}

    public ReviewRequest(String text) {
        this.text = text;
    }

    public ReviewRequest(String text, String source) {
        this.text = text;
        this.source = source;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}
