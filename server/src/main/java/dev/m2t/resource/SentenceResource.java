package dev.m2t.resource;

import dev.m2t.model.Sentence;
import dev.m2t.model.Story;
import dev.m2t.model.dto.CreateSentenceDto;
import dev.m2t.service.SentenceService;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.persistence.EntityNotFoundException;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.Map;

@Path("/sentences")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SentenceResource {

    @Inject
    SentenceService sentenceService;

    @POST
    public Uni<Response> createSentence(CreateSentenceDto sentenceDto) {
        return sentenceService.createSentence(sentenceDto)
                .map(sentence -> Response.status(Response.Status.CREATED).entity(sentence).build())
                .onFailure(EntityNotFoundException.class)
                .recoverWithItem(throwable ->
                        Response.status(Response.Status.NOT_FOUND)
                                .entity(Map.of("error", throwable.getMessage()))
                                .build()
                );
    }

    @GET
    @Path("/{storyId}")
    public Uni<List<Sentence>> getSentencesByStoryId(@PathParam("storyId") Long storyId) {
        return sentenceService.getTopVotedSentencesByStoryId(storyId);
    }
}