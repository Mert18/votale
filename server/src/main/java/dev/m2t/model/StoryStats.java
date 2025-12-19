package dev.m2t.model;

import io.quarkus.hibernate.reactive.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import java.time.LocalDateTime;

@Entity
public class StoryStats extends PanacheEntity {

    @Column(nullable = false)
    public Long possibleStoryCount;

    @Column(nullable = false)
    public LocalDateTime calculatedAt;

    public StoryStats() {
        this.calculatedAt = LocalDateTime.now();
    }

    public StoryStats(Long possibleStoryCount) {
        this.possibleStoryCount = possibleStoryCount;
        this.calculatedAt = LocalDateTime.now();
    }
}
