package dev.m2t.model.dto;

import dev.m2t.model.Sentence;

public class SentenceResponseDto {
    public Long id;
    public Long votes;
    public String content;
    public Long previousSentenceId;

    // Constructor from entity
    public SentenceResponseDto(Sentence sentence) {
        this.id = sentence.id;
        this.votes = sentence.votes;
        this.content = sentence.content;
        this.previousSentenceId = sentence.previousSentence != null ? sentence.previousSentence.id : null;
    }
}