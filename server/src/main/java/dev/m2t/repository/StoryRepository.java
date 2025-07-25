package dev.m2t.repository;

import dev.m2t.model.Story;
import dev.m2t.model.dto.StoryStatsDto;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.hibernate.reactive.mutiny.Mutiny;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class StoryRepository {

    @Inject
    Mutiny.SessionFactory sessionFactory;

    @SuppressWarnings("unchecked")
    public Uni<List<StoryStatsDto>> findAllWithStats() {
        return sessionFactory.withTransaction((session, transaction) ->
                session.createNativeQuery("""
            SELECT 
                st.id,
                st.name,
                st.lang,
                COALESCE(COUNT(DISTINCT sen.sentence_order), 0) as sentence_count,
                COALESCE(SUM(sen.votes), 0) as total_votes
            FROM Story st
            LEFT JOIN Sentence sen ON st.id = sen.story_id
            GROUP BY st.id, st.name, st.lang
            ORDER BY COALESCE(SUM(sen.votes), 0) DESC
            """)
                        .getResultList()
        ).map(results -> {
            return results.stream()
                    .map(row -> new StoryStatsDto((Object[]) row))
                    .collect(Collectors.toList());
        });
    }

    public Uni<Story> save(Story story) {
        return sessionFactory.withTransaction((session, transaction) ->
                session.persist(story)
                        .map(ignored -> story)
        );
    }

    public Uni<Story> findById(Long id) {
        return sessionFactory.withTransaction((session, transaction) ->
                session.find(Story.class, id)
        );
    }
}