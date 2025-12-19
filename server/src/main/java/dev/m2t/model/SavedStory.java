package dev.m2t.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.quarkus.hibernate.reactive.panache.PanacheEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class SavedStory extends PanacheEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    public User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    public String sentenceIds;  // JSON array: "[1,5,12,23]"

    @Column(nullable = false)
    public LocalDateTime createdAt;

    // Denormalized for quick display
    @Column(columnDefinition = "TEXT")
    public String firstSentenceContent;

    @Column(columnDefinition = "TEXT")
    public String lastSentenceContent;

    public Integer pathLength;

    public SavedStory() {
        this.createdAt = LocalDateTime.now();
    }

    @JsonProperty("userId")
    public Long getUserId() {
        return user != null ? user.id : null;
    }

    @JsonProperty("userName")
    public String getUserName() {
        return user != null ? user.name : null;
    }
}
