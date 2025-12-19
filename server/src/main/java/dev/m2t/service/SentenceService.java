package dev.m2t.service;

import dev.m2t.model.Sentence;
import dev.m2t.model.User;
import dev.m2t.model.Vote;
import dev.m2t.model.dto.CreateSentenceDto;
import dev.m2t.model.dto.SentenceResponseDto;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.hibernate.reactive.mutiny.Mutiny;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class SentenceService {

    @Inject
    Mutiny.SessionFactory sf;

    @Transactional
    public Uni<Sentence> createSentence(CreateSentenceDto sentenceDto, Long authorId) {
        return sf.withTransaction((s, t) ->
            s.find(User.class, authorId)
                .onItem().ifNull().failWith(() ->
                    new EntityNotFoundException("User not found"))
                .chain(author -> {
                    if(sentenceDto.getPreviousSentenceId() != null) {
                        return findSentenceById(s, sentenceDto.getPreviousSentenceId())
                                .chain(prevSentence -> persistSentence(s, sentenceDto, author));
                    } else {
                        return persistSentence(s, sentenceDto, author);
                    }
                })
        );
    }

    private Uni<Sentence> findSentenceById(Mutiny.Session session, Long sentenceId) {
        if (sentenceId == null) {
            return Uni.createFrom().nullItem();
        }

        return session.find(Sentence.class, sentenceId);
    }

    private Uni<Sentence> persistSentence(Mutiny.Session session, CreateSentenceDto dto, User author) {
        Sentence sentence = new Sentence();
        sentence.content = dto.getContent();
        sentence.votes = 0L;
        sentence.author = author;

        if (dto.getPreviousSentenceId() != null) {
            return session.find(Sentence.class, dto.getPreviousSentenceId())
                .chain(prevSentence -> {
                    sentence.previousSentence = prevSentence;
                    return session.persist(sentence)
                        .chain(() -> session.fetch(sentence.author))
                        .map(ignored -> sentence);
                });
        }

        return session.persist(sentence)
            .chain(() -> session.fetch(sentence.author))
            .map(ignored -> sentence);
    }

    public Uni<List<Sentence>> getFirstSentences() {
        return sf.withSession(session ->
            session.createQuery(
                "SELECT s FROM Sentence s LEFT JOIN FETCH s.author WHERE s.previousSentence IS NULL ORDER BY RANDOM()",
                Sentence.class
            )
            .setMaxResults(10)
            .getResultList()
            .chain(sentences -> {
                // Calculate total path votes for each first sentence
                List<Uni<Sentence>> sentenceUnis = sentences.stream()
                    .map(sentence -> calculateTotalPathVotes(session, sentence.id)
                        .map(totalVotes -> {
                            sentence.setTotalPathVotes(totalVotes);
                            return sentence;
                        })
                    )
                    .collect(Collectors.toList());

                return Uni.join().all(sentenceUnis).andCollectFailures();
            })
        );
    }

    private Uni<Long> calculateTotalPathVotes(Mutiny.Session session, Long sentenceId) {
        // Use a recursive CTE to sum all votes from descendants
        String sql = """
            WITH RECURSIVE sentence_tree AS (
                SELECT id, votes, previous_sentence_id
                FROM Sentence
                WHERE id = :sentenceId
                UNION ALL
                SELECT s.id, s.votes, s.previous_sentence_id
                FROM Sentence s
                INNER JOIN sentence_tree st ON s.previous_sentence_id = st.id
            )
            SELECT COALESCE(SUM(votes), 0) FROM sentence_tree
            """;

        return session.createNativeQuery(sql, Long.class)
            .setParameter("sentenceId", sentenceId)
            .getSingleResult();
    }

    public Uni<List<SentenceResponseDto>> getNextSentences(Long sentenceId, String sortBy, int page) {
        String orderBy = sortBy.equals("random") ? "ORDER BY RANDOM()" : "ORDER BY s.votes DESC";
        String query = "SELECT s FROM Sentence s LEFT JOIN FETCH s.author WHERE s.previousSentence.id = :sentenceId " + orderBy;
        int offset = page * 4;

        return sf.withSession(session ->
            session.createQuery(query, Sentence.class)
            .setParameter("sentenceId", sentenceId)
            .setFirstResult(offset)
            .setMaxResults(4)
            .getResultList()
            .chain(sentences -> {
                if (sentences.isEmpty()) {
                    return Uni.createFrom().item(List.of());
                }

                // Get child counts for all sentences in one query
                List<Long> sentenceIds = sentences.stream()
                    .map(s -> s.id)
                    .collect(Collectors.toList());

                String countQuery = """
                    SELECT previous_sentence_id, COUNT(*)
                    FROM Sentence
                    WHERE previous_sentence_id IN (:ids)
                    GROUP BY previous_sentence_id
                    """;

                return session.createNativeQuery(countQuery, Object[].class)
                    .setParameter("ids", sentenceIds)
                    .getResultList()
                    .map(results -> {
                        // Create a map of sentenceId -> childCount
                        java.util.Map<Long, Long> childCountMap = results.stream()
                            .collect(Collectors.toMap(
                                row -> ((Number) row[0]).longValue(),
                                row -> ((Number) row[1]).longValue()
                            ));

                        // Map sentences to DTOs with child counts
                        return sentences.stream()
                            .map(sentence -> {
                                Long childCount = childCountMap.getOrDefault(sentence.id, 0L);
                                return new SentenceResponseDto(sentence, childCount);
                            })
                            .collect(Collectors.toList());
                    });
            })
        );
    }

    public Uni<Sentence> voteSentence(Long sentenceId, Long userId) {
        return sf.withTransaction((session, transaction) ->
            Vote.hasUserVoted(userId, sentenceId)
                .chain(hasVoted -> {
                    if (hasVoted) {
                        return Uni.createFrom().failure(
                            new IllegalStateException("User has already voted for this sentence")
                        );
                    }

                    return session.createQuery(
                        "SELECT s FROM Sentence s LEFT JOIN FETCH s.author WHERE s.id = :sentenceId",
                        Sentence.class
                    )
                    .setParameter("sentenceId", sentenceId)
                    .getSingleResult()
                        .onItem().ifNull().failWith(() ->
                            new EntityNotFoundException("Sentence not found"))
                        .chain(sentence -> session.find(User.class, userId)
                            .onItem().ifNull().failWith(() ->
                                new EntityNotFoundException("User not found"))
                            .chain(user -> {
                                Vote vote = new Vote();
                                vote.user = user;
                                vote.sentence = sentence;

                                sentence.votes++;

                                return session.persist(vote)
                                    .chain(() -> session.merge(sentence));
                            })
                        );
                })
        );
    }

    public Uni<List<Sentence>> generateRandomStory() {
        return sf.withSession(session ->
            // Start with a random first sentence
            session.createQuery(
                "SELECT s FROM Sentence s LEFT JOIN FETCH s.author WHERE s.previousSentence IS NULL ORDER BY RANDOM()",
                Sentence.class
            )
            .setMaxResults(1)
            .getSingleResultOrNull()
            .chain(firstSentence -> {
                if (firstSentence == null) {
                    return Uni.createFrom().item(List.of());
                }

                List<Sentence> story = new java.util.ArrayList<>();
                story.add(firstSentence);

                // Recursively build the story
                return buildRandomStoryPath(session, firstSentence, story);
            })
        );
    }

    private Uni<List<Sentence>> buildRandomStoryPath(Mutiny.Session session, Sentence currentSentence, List<Sentence> story) {
        // Get a random child sentence
        return session.createQuery(
            "SELECT s FROM Sentence s LEFT JOIN FETCH s.author WHERE s.previousSentence.id = :sentenceId ORDER BY RANDOM()",
            Sentence.class
        )
        .setParameter("sentenceId", currentSentence.id)
        .setMaxResults(1)
        .getSingleResultOrNull()
        .chain(nextSentence -> {
            if (nextSentence == null) {
                // No more children, return the complete story
                return Uni.createFrom().item(story);
            }

            // Add the next sentence and continue recursively
            story.add(nextSentence);
            return buildRandomStoryPath(session, nextSentence, story);
        });
    }
}