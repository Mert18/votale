package dev.m2t.service;

import dev.m2t.model.Sentence;
import dev.m2t.model.Story;
import dev.m2t.model.dto.CreateSentenceDto;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.hibernate.reactive.mutiny.Mutiny;

import java.util.List;

@ApplicationScoped
public class SentenceService {

    @Inject
    Mutiny.SessionFactory sf;

    @Transactional
    public Uni<Sentence> createSentence(CreateSentenceDto sentenceDto) {
        return sf.withTransaction((s, t) ->
                findStoryById(s, sentenceDto.getStoryId())
                        .chain(story -> persistSentence(s, story, sentenceDto))
        );
    }

    private Uni<Story> findStoryById(Mutiny.Session session, Long storyId) {
        return session.find(Story.class, storyId)
                .onItem().ifNull().failWith(
                        new EntityNotFoundException("Story not found with id: " + storyId)
                );
    }

    private Uni<Sentence> persistSentence(Mutiny.Session session, Story story, CreateSentenceDto dto) {
        Sentence sentence = new Sentence();
        sentence.story = story;
        sentence.order = dto.getOrder();
        sentence.content = dto.getContent();
        sentence.votes = 0L;
        return session.persist(sentence).map(ignored -> sentence);
    }

    public Uni<List<Sentence>> getTopVotedSentencesByStoryId(Long storyId) {
        return sf.withTransaction((s, t) ->
                s.createQuery("""
                SELECT s FROM Sentence s 
                WHERE s.story.id = :storyId 
                AND s.votes = (
                    SELECT MAX(s2.votes) 
                    FROM Sentence s2 
                    WHERE s2.story.id = :storyId 
                    AND s2.order = s.order
                )
                ORDER BY s.order
                """, Sentence.class)
                        .setParameter("storyId", storyId)
                        .getResultList()
        );
    }
}