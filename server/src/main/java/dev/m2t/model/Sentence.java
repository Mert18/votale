package dev.m2t.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.quarkus.hibernate.reactive.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
public class Sentence extends PanacheEntity {
    public Long votes = 0L;

    public String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "previous_sentence_id")
    @JsonIgnore
    public Sentence previousSentence;

    public Sentence() {
    }

    public Sentence(String content) {
        this.content = content;
    }

    public Sentence(Long votes, String content) {
        this.votes = votes;
        this.content = content;
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
}