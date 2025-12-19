package dev.m2t.service;

import dev.m2t.model.SavedStory;
import dev.m2t.model.Sentence;
import dev.m2t.model.User;
import dev.m2t.model.dto.CreateSavedStoryDto;
import dev.m2t.model.dto.SavedStoryDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityNotFoundException;
import org.hibernate.reactive.mutiny.Mutiny;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ApplicationScoped
public class SavedStoryService {

    @Inject
    Mutiny.SessionFactory sf;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public Uni<SavedStoryDto> saveStory(Long userId, CreateSavedStoryDto dto) {
        if (dto.getSentenceIds() == null || dto.getSentenceIds().isEmpty()) {
            return Uni.createFrom().failure(
                new IllegalArgumentException("Sentence IDs cannot be empty")
            );
        }

        return sf.withTransaction((session, transaction) ->
            // Fetch user
            session.find(User.class, userId)
                .onItem().ifNull().failWith(() ->
                    new EntityNotFoundException("User not found"))
                .chain(user -> {
                    // Fetch first and last sentences for denormalization
                    Long firstId = dto.getSentenceIds().get(0);
                    Long lastId = dto.getSentenceIds().get(dto.getSentenceIds().size() - 1);

                    return Uni.combine().all()
                        .unis(
                            session.find(Sentence.class, firstId),
                            session.find(Sentence.class, lastId)
                        )
                        .asTuple()
                        .chain(tuple -> {
                            Sentence firstSentence = tuple.getItem1();
                            Sentence lastSentence = tuple.getItem2();

                            if (firstSentence == null || lastSentence == null) {
                                return Uni.createFrom().failure(
                                    new EntityNotFoundException("One or more sentences not found")
                                );
                            }

                            // Create SavedStory entity
                            SavedStory savedStory = new SavedStory();
                            savedStory.user = user;
                            savedStory.pathLength = dto.getSentenceIds().size();

                            // Serialize sentence IDs to JSON
                            try {
                                savedStory.sentenceIds = objectMapper.writeValueAsString(dto.getSentenceIds());
                            } catch (Exception e) {
                                return Uni.createFrom().failure(e);
                            }

                            // Denormalize for quick display
                            savedStory.firstSentenceContent = firstSentence.content;
                            savedStory.lastSentenceContent = lastSentence.content;

                            return session.persist(savedStory)
                                .chain(() -> session.fetch(savedStory.user))
                                .map(ignored -> new SavedStoryDto(savedStory));
                        });
                })
        );
    }

    public Uni<List<SavedStoryDto>> getUserSavedStories(Long userId) {
        return sf.withSession(session ->
            session.createQuery(
                "SELECT s FROM SavedStory s LEFT JOIN FETCH s.user WHERE s.user.id = :userId ORDER BY s.createdAt DESC",
                SavedStory.class
            )
            .setParameter("userId", userId)
            .getResultList()
            .map(stories -> stories.stream()
                .map(SavedStoryDto::new)
                .collect(Collectors.toList()))
        );
    }

    public Uni<SavedStoryDto> getSavedStoryById(Long savedStoryId) {
        return sf.withSession(session ->
            session.createQuery(
                "SELECT s FROM SavedStory s LEFT JOIN FETCH s.user WHERE s.id = :savedStoryId",
                SavedStory.class
            )
            .setParameter("savedStoryId", savedStoryId)
            .getSingleResultOrNull()
            .onItem().ifNull().failWith(() ->
                new EntityNotFoundException("Saved story not found"))
            .map(SavedStoryDto::new)
        );
    }

    public Uni<List<Sentence>> reconstructStoryPath(Long savedStoryId) {
        return sf.withSession(session ->
            // First get the SavedStory
            session.find(SavedStory.class, savedStoryId)
                .onItem().ifNull().failWith(() ->
                    new EntityNotFoundException("Saved story not found"))
                .chain(savedStory -> {
                    // Parse sentence IDs from JSON
                    List<Long> sentenceIds;
                    try {
                        sentenceIds = objectMapper.readValue(
                            savedStory.sentenceIds,
                            objectMapper.getTypeFactory().constructCollectionType(List.class, Long.class)
                        );
                    } catch (Exception e) {
                        return Uni.createFrom().failure(e);
                    }

                    if (sentenceIds.isEmpty()) {
                        return Uni.createFrom().item(List.of());
                    }

                    // Fetch all sentences at once
                    return session.createQuery(
                        "SELECT s FROM Sentence s LEFT JOIN FETCH s.author WHERE s.id IN :ids",
                        Sentence.class
                    )
                    .setParameter("ids", sentenceIds)
                    .getResultList()
                    .map(sentences -> {
                        // Create a map for quick lookup
                        Map<Long, Sentence> sentenceMap = new HashMap<>();
                        for (Sentence s : sentences) {
                            sentenceMap.put(s.id, s);
                        }

                        // Reconstruct in correct order
                        List<Sentence> orderedSentences = new ArrayList<>();
                        for (Long id : sentenceIds) {
                            Sentence sentence = sentenceMap.get(id);
                            if (sentence != null) {
                                orderedSentences.add(sentence);
                            }
                        }

                        return orderedSentences;
                    });
                })
        );
    }

    public Uni<Void> deleteSavedStory(Long userId, Long savedStoryId) {
        return sf.withTransaction((session, transaction) ->
            session.find(SavedStory.class, savedStoryId)
                .onItem().ifNull().failWith(() ->
                    new EntityNotFoundException("Saved story not found"))
                .chain(savedStory -> {
                    // Verify ownership
                    if (savedStory.user.id.longValue() != userId.longValue()) {
                        return Uni.createFrom().failure(
                            new SecurityException("You can only delete your own saved stories")
                        );
                    }

                    return session.remove(savedStory);
                })
        );
    }
}
