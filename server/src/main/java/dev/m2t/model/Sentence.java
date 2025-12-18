package dev.m2t.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.quarkus.hibernate.reactive.panache.PanacheEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Sentence extends PanacheEntity {
    public Long votes = 0L;

    public String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "previous_sentence_id")
    @JsonIgnore
    public Sentence previousSentence;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    @JsonIgnore
    public User author;

    @Column(nullable = false)
    public LocalDateTime createdAt;

    public Sentence() {
        this.createdAt = LocalDateTime.now();
    }

    public Sentence(String content) {
        this.content = content;
        this.createdAt = LocalDateTime.now();
    }

    public Sentence(Long votes, String content) {
        this.votes = votes;
        this.content = content;
        this.createdAt = LocalDateTime.now();
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

    public boolean isFirst() {
        return previousSentence == null;
    }

    @JsonProperty("previousSentenceId")
    public Long getPreviousSentenceId() {
        return previousSentence != null ? previousSentence.id : null;
    }

    @JsonProperty("authorName")
    public String getAuthorName() {
        return author != null ? author.name : null;
    }

    @JsonProperty("authorId")
    public Long getAuthorId() {
        return author != null ? author.id : null;
    }
}