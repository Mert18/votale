package dev.m2t.repository;

import dev.m2t.model.Story;
import dev.m2t.model.dto.StoryStatsDTO;
import io.quarkus.hibernate.reactive.panache.PanacheRepository;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.hibernate.reactive.mutiny.Mutiny;

import java.util.List;

@ApplicationScoped
public class StoryRepository implements PanacheRepository<Story> {
    @Inject
    Mutiny.SessionFactory sessionFactory;

    public Uni<List<StoryStatsDTO>> findStoriesWithStats(int page, int size) {
        String sql = """
        SELECT s.id, s.name, COUNT(sent.id), COALESCE(SUM(sent.votes), 0)
        FROM story s
        LEFT JOIN sentence sent ON sent.story_id = s.id
        GROUP BY s.id, s.name
        ORDER BY COUNT(sent.id) DESC, SUM(sent.votes) DESC
        LIMIT ?1 OFFSET ?2
        """;

        return sessionFactory.withSession(session ->
                session.createNativeQuery(sql)
                        .setParameter(1, size)
                        .setParameter(2, page * size)
                        .getResultList()
        ).map(rows -> rows.stream().map(result -> {
            Object[] r = (Object[]) result;
            return new StoryStatsDTO(
                    ((Number) r[0]).longValue(),
                    (String) r[1],
                    ((Number) r[2]).longValue(),
                    ((Number) r[3]).longValue()
            );
        }).toList());
    }
}