package dev.m2t.resource;

import dev.m2t.model.dto.CreateSentenceDto;
import dev.m2t.service.SentenceService;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.persistence.EntityNotFoundException;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Map;

@Path("/api/sentences")
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
    @Path("/{sentenceId}")
    public Uni<Response> getNextSentences(@PathParam("sentenceId") Long sentenceId) {
        return sentenceService.getNextSentences(sentenceId)
                .map(sentences -> Response.ok(sentences).build());
    }

    @GET
    @Path("/first")
    public Uni<Response> getFirstSentences() {
        return sentenceService.getFirstSentences()
                .map(sentences -> Response.ok(sentences).build());
    }
}