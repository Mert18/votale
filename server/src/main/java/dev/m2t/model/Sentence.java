package dev.m2t.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.quarkus.hibernate.reactive.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
public class Sentence extends PanacheEntity {
    @ManyToOne
    @JoinColumn(name = "story_id", nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    public Story story;

    @Column(name = "sentence_order")
    public Long order;

    public Long votes = 0L;

    public String content;

    public Sentence() {
    }

    public Sentence(Story story, Long order, String content) {
        this.story = story;
        this.order = order;
        this.content = content;
    }

    public Sentence(Story story, Long order, Long votes, String content) {
        this.story = story;
        this.order = order;
        this.votes = votes;
        this.content = content;
    }

    public Story getStory() {
        return story;
    }

    public void setStory(Story story) {
        this.story = story;
    }

    public Long getOrder() {
        return order;
    }

    public void setOrder(Long order) {
        this.order = order;
    }

    public Long getVotes() {
        return votes;
    }

    public void setVotes(Long votes) {
        this.votes = votes;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}