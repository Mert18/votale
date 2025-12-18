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
        );
    }

    public Uni<List<SentenceResponseDto>> getNextSentences(Long sentenceId) {
        return sf.withSession(session ->
            session.createQuery(
                "SELECT s FROM Sentence s LEFT JOIN FETCH s.author WHERE s.previousSentence.id = :sentenceId ORDER BY s.votes DESC",
                Sentence.class
            )
            .setParameter("sentenceId", sentenceId)
            .getResultList()
            .map(sentences -> sentences.stream()
                    .map(SentenceResponseDto::new)
                    .collect(Collectors.toList()))
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
}