package dev.m2t.model.dto;

public class CreateSentenceDto {
    private Long storyId;
    private Long order;
    private String content;

    public CreateSentenceDto() {}

    public CreateSentenceDto(Long storyId, Long order, String content) {
        this.storyId = storyId;
        this.order = order;
        this.content = content;
    }

    public Long getStoryId() {
        return storyId;
    }

    public void setStoryId(Long storyId) {
        this.storyId = storyId;
    }

    public Long getOrder() {
        return order;
    }

    public void setOrder(Long order) {
        this.order = order;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
