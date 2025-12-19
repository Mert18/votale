package dev.m2t.resource;

import dev.m2t.model.dto.CreateSentenceDto;
import dev.m2t.service.SentenceService;
import io.smallrye.mutiny.Uni;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.persistence.EntityNotFoundException;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.Map;

@Path("/api/sentences")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SentenceResource {

    @Inject
    SentenceService sentenceService;

    @Inject
    JsonWebToken jwt;

    @POST
    @RolesAllowed("User")
    public Uni<Response> createSentence(CreateSentenceDto sentenceDto) {
        Long userId = Long.parseLong(jwt.getSubject());

        return sentenceService.createSentence(sentenceDto, userId)
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
    @RolesAllowed("User")
    public Uni<Response> getNextSentences(
            @PathParam("sentenceId") Long sentenceId,
            @QueryParam("sortBy") @DefaultValue("votes") String sortBy,
            @QueryParam("page") @DefaultValue("0") int page) {
        return sentenceService.getNextSentences(sentenceId, sortBy, page)
                .map(sentences -> Response.ok(sentences).build());
    }

    @GET
    @Path("/first")
    @RolesAllowed("User")
    public Uni<Response> getFirstSentences() {
        return sentenceService.getFirstSentences()
                .map(sentences -> Response.ok(sentences).build());
    }

    @GET
    @Path("/random-story")
    @RolesAllowed("User")
    public Uni<Response> getRandomStory() {
        return sentenceService.generateRandomStory()
                .map(sentences -> Response.ok(sentences).build());
    }

    @POST
    @Path("/{sentenceId}/vote")
    @RolesAllowed("User")
    public Uni<Response> voteSentence(@PathParam("sentenceId") Long sentenceId) {
        Long userId = Long.parseLong(jwt.getSubject());

        return sentenceService.voteSentence(sentenceId, userId)
            .map(sentence -> Response.ok(sentence).build())
            .onFailure(IllegalStateException.class)
            .recoverWithItem(throwable ->
                Response.status(Response.Status.CONFLICT)
                    .entity(Map.of("error", throwable.getMessage()))
                    .build()
            )
            .onFailure(EntityNotFoundException.class)
            .recoverWithItem(throwable ->
                Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("error", throwable.getMessage()))
                    .build()
            );
    }
}