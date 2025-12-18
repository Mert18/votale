package dev.m2t.model;

import io.quarkus.hibernate.reactive.panache.PanacheEntity;
import io.smallrye.mutiny.Uni;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "votes",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "sentence_id"})
)
public class Vote extends PanacheEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    public User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sentence_id", nullable = false)
    public Sentence sentence;

    @Column(nullable = false)
    public LocalDateTime votedAt;

    public Vote() {
        this.votedAt = LocalDateTime.now();
    }

    // Check if user has already voted
    public static Uni<Boolean> hasUserVoted(Long userId, Long sentenceId) {
        return count("user.id = ?1 and sentence.id = ?2", userId, sentenceId)
            .map(count -> count > 0);
    }
}
