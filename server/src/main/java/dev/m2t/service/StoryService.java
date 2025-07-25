package dev.m2t.service;


import dev.m2t.model.Story;
import dev.m2t.model.dto.CreateStoryDto;
import dev.m2t.model.dto.StoryStatsDto;
import dev.m2t.repository.StoryRepository;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class StoryService {

    @Inject
    StoryRepository storyRepository;

    public Uni<List<StoryStatsDto>> getAllStoriesWithStats() {
        return storyRepository.findAllWithStats();
    }

    @Transactional
    public Uni<Story> createStory(CreateStoryDto createStoryDto) {
        return validateStoryData(createStoryDto)
                .chain(this::mapToEntity)
                .chain(storyRepository::save);
    }

    public Uni<Story> findStoryById(Long id) {
        return storyRepository.findById(id)
                .onItem().ifNull().failWith(
                        new RuntimeException("Story not found with id: " + id)
                );
    }

    private Uni<CreateStoryDto> validateStoryData(CreateStoryDto dto) {
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            return Uni.createFrom().failure(
                    new IllegalArgumentException("Story name cannot be empty")
            );
        }
        if (dto.getLang() == null || dto.getLang().trim().isEmpty()) {
            return Uni.createFrom().failure(
                    new IllegalArgumentException("Story language cannot be empty")
            );
        }
        return Uni.createFrom().item(dto);
    }

    private Uni<Story> mapToEntity(CreateStoryDto dto) {
        Story story = new Story();
        story.name = dto.getName().trim();
        story.lang = dto.getLang().trim();
        return Uni.createFrom().item(story);
    }
}