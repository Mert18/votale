package dev.m2t.model.dto;

public class CreateSentenceDto {
    private Long previousSentenceId;
    private String content;

    public CreateSentenceDto() {}

    public CreateSentenceDto(Long previousSentenceId, String content) {
        this.previousSentenceId = previousSentenceId;
        this.content = content;
    }

    public Long getPreviousSentenceId() {
        return previousSentenceId;
    }

    public void setPreviousSentenceId(Long previousSentenceId) {
        this.previousSentenceId = previousSentenceId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
