package dev.m2t.model.dto;

import dev.m2t.model.SavedStory;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.List;

public class SavedStoryDto {
    public Long id;
    public Long userId;
    public String userName;
    public List<Long> sentenceIds;
    public String firstSentenceContent;
    public String lastSentenceContent;
    public Integer pathLength;
    public LocalDateTime createdAt;

    public SavedStoryDto(SavedStory savedStory) {
        this.id = savedStory.id;
        this.userId = savedStory.getUserId();
        this.userName = savedStory.getUserName();
        this.firstSentenceContent = savedStory.firstSentenceContent;
        this.lastSentenceContent = savedStory.lastSentenceContent;
        this.pathLength = savedStory.pathLength;
        this.createdAt = savedStory.createdAt;

        // Parse JSON array of sentence IDs
        try {
            ObjectMapper mapper = new ObjectMapper();
            this.sentenceIds = mapper.readValue(savedStory.sentenceIds, new TypeReference<List<Long>>() {});
        } catch (Exception e) {
            this.sentenceIds = List.of();
        }
    }
}
