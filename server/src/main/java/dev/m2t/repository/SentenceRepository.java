package dev.m2t.repository;

import dev.m2t.model.Sentence;
import io.quarkus.hibernate.reactive.panache.PanacheRepository;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class SentenceRepository implements PanacheRepository<Sentence> {

    @WithSession
    public Uni<List<Sentence>> findByStoryIdPaged(Long storyId, int page, int size) {
        return find("story.id = ?1 ORDER BY order", storyId)
                .page(page, size)
                .list();
    }

    @WithSession
    public Uni<Long> countByStoryId(Long storyId) {
        return count("story.id = ?1", storyId);
    }
}