package dev.m2t.service;

import dev.m2t.model.StoryStats;
import io.quarkus.scheduler.Scheduled;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.hibernate.reactive.mutiny.Mutiny;
import org.jboss.logging.Logger;

@ApplicationScoped
public class StoryStatsService {

    private static final Logger LOG = Logger.getLogger(StoryStatsService.class);

    @Inject
    Mutiny.SessionFactory sf;

    @Scheduled(every = "30m", delay = 1)
    public Uni<Void> calculateStoryCountScheduled() {
        LOG.info("Starting scheduled story count calculation");
        return calculateAndStoreStoryCount()
            .onItem().invoke(() -> LOG.info("Story count calculation completed"))
            .onFailure().invoke(e -> LOG.error("Story count calculation failed", e))
            .replaceWithVoid();
    }

    public Uni<Void> calculateAndStoreStoryCount() {
        return sf.withTransaction((session, transaction) ->
            calculatePossibleStoryCount(session)
                .chain(count -> {
                    StoryStats stats = new StoryStats(count);
                    return session.persist(stats);
                })
        );
    }

    private Uni<Long> calculatePossibleStoryCount(Mutiny.Session session) {
        // Calculate the total number of possible story paths
        // A path is counted from each first sentence through all its branches
        // We use a recursive CTE to traverse the tree and count all paths
        String sql = """
            WITH RECURSIVE story_paths AS (
                -- Start with all first sentences (base case)
                SELECT
                    id,
                    1::bigint as path_count,
                    ARRAY[id] as path
                FROM Sentence
                WHERE previous_sentence_id IS NULL

                UNION ALL

                -- For each sentence, multiply path count by number of children
                SELECT
                    s.id,
                    sp.path_count,
                    sp.path || s.id
                FROM Sentence s
                INNER JOIN story_paths sp ON s.previous_sentence_id = sp.id
            ),
            -- Count children for each sentence
            children_count AS (
                SELECT
                    previous_sentence_id,
                    COUNT(*) as child_count
                FROM Sentence
                WHERE previous_sentence_id IS NOT NULL
                GROUP BY previous_sentence_id
            ),
            -- Calculate paths through each node
            path_multipliers AS (
                SELECT
                    sp.id,
                    CASE
                        WHEN cc.child_count IS NULL THEN sp.path_count
                        ELSE sp.path_count * cc.child_count
                    END as paths_through
                FROM story_paths sp
                LEFT JOIN children_count cc ON sp.id = cc.previous_sentence_id
            )
            SELECT COALESCE(SUM(paths_through), 0)
            FROM path_multipliers
            WHERE id NOT IN (
                SELECT DISTINCT previous_sentence_id
                FROM Sentence
                WHERE previous_sentence_id IS NOT NULL
            )
            """;

        return session.createNativeQuery(sql, Long.class)
            .getSingleResult();
    }

    public Uni<StoryStats> getLatestStats() {
        return sf.withSession(session ->
            session.createQuery(
                "SELECT s FROM StoryStats s ORDER BY s.calculatedAt DESC",
                StoryStats.class
            )
            .setMaxResults(1)
            .getSingleResultOrNull()
        );
    }
}
