package dev.m2t.service;

import dev.m2t.model.dto.StoryStatsDTO;
import dev.m2t.repository.StoryRepository;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;

@ApplicationScoped
public class StoryService {
    @Inject
    StoryRepository repository;

    public Uni<List<StoryStatsDTO>> getStoriesWithStats(int page, int size) {
        return repository.findStoriesWithStats(page, size);
    }
}
