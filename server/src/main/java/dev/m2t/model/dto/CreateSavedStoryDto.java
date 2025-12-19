package dev.m2t.model.dto;

import java.util.List;

public class CreateSavedStoryDto {
    public List<Long> sentenceIds;

    public CreateSavedStoryDto() {
    }

    public CreateSavedStoryDto(List<Long> sentenceIds) {
        this.sentenceIds = sentenceIds;
    }

    public List<Long> getSentenceIds() {
        return sentenceIds;
    }

    public void setSentenceIds(List<Long> sentenceIds) {
        this.sentenceIds = sentenceIds;
    }
}
