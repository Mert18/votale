package dev.m2t.resource;

import dev.m2t.model.Story;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.hibernate.reactive.mutiny.Mutiny;



@Path("/stories")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class StoryResource {

    @Inject
    Mutiny.SessionFactory sf;

    @GET
    public Uni<Response> getStories() {
        return sf.withTransaction((s, t) ->
                s.createNativeQuery("""
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
        ).map(results -> Response.ok(results).build());
    }

    @POST
    public Uni<Response> createStory(Story story) {
        return sf.withTransaction((s, t) -> s.persist(story))
                .replaceWith(Response.ok(story).status(Response.Status.CREATED)::build);
    }

}
