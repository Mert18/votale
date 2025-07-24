package dev.m2t.service;

import dev.m2t.model.Sentence;
import dev.m2t.repository.SentenceRepository;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;

@ApplicationScoped
public class SentenceService {
    @Inject
    SentenceRepository repository;

    @WithSession
    public Uni<List<Sentence>> getSentences(Long storyId, int page, int size) {
        return repository.findByStoryIdPaged(storyId, page, size);
    }

    @WithSession
    public Uni<Long> countSentences(Long storyId) {
        return repository.countByStoryId(storyId);
    }
}