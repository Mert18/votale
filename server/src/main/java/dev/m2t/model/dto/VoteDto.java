package dev.m2t.model.dto;

public class VoteDto {
    private Long sentenceId;

    public VoteDto() {}

    public Long getSentenceId() {
        return sentenceId;
    }

    public void setSentenceId(Long sentenceId) {
        this.sentenceId = sentenceId;
    }
}
