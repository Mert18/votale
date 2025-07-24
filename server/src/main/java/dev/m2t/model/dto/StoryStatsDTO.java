package dev.m2t.model.dto;

public class StoryStatsDTO {
    public Long storyId;
    public String storyName;
    public Long sentenceCount;
    public Long totalVotes;

    public StoryStatsDTO(Long storyId, String storyName, Long sentenceCount, Long totalVotes) {
        this.storyId = storyId;
        this.storyName = storyName;
        this.sentenceCount = sentenceCount;
        this.totalVotes = totalVotes;
    }
}