package dev.m2t.resource;

import dev.m2t.model.Sentence;
import dev.m2t.model.Story;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.hibernate.reactive.mutiny.Mutiny;

import java.util.List;

@Path("/sentences")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SentenceResource {


    @Inject
    Mutiny.SessionFactory sf;

    @GET
    @Path("/{storyId}")
    public Uni<List<Sentence>> getTopVotedSentencesByStoryId(@PathParam("storyId") Long storyId) {
        return sf.withTransaction((s, t) ->
                s.createQuery("""
                                SELECT s FROM Sentence s WHERE s.id IN (
                                    SELECT s2.id FROM Sentence s2 
                                    WHERE s2.story.id = :storyId 
                                    AND s2.votes = (
                                        SELECT MAX(s3.votes) 
                                        FROM Sentence s3 
                                        WHERE s3.story.id = :storyId 
                                        AND s3.order = s2.order
                                    )
                                ) ORDER BY s.order
                                """, Sentence.class)
                        .setParameter("storyId", storyId)
                        .getResultList()
        );
    }

    @POST
    public Uni<Response> createSentence(Sentence sentence) {
        return sf.withTransaction((s, t) ->
            s.find(Story.class, sentence.story.id)
                    .onItem().ifNull().failWith(new WebApplicationException("Story could not found.", Response.Status.NOT_FOUND))
                    .chain(story -> {
                        sentence.story = story;
                        return s.persist(sentence);
                    })
        ).replaceWith(Response.ok(sentence).status(Response.Status.CREATED)::build);
    }
}