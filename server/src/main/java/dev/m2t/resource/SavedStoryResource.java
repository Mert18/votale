package dev.m2t.resource;

import dev.m2t.model.dto.CreateSavedStoryDto;
import dev.m2t.service.SavedStoryService;
import io.smallrye.mutiny.Uni;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.persistence.EntityNotFoundException;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.Map;

@Path("/api/saved-stories")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SavedStoryResource {

    @Inject
    SavedStoryService savedStoryService;

    @Inject
    JsonWebToken jwt;

    @POST
    @RolesAllowed("User")
    public Uni<Response> saveStory(CreateSavedStoryDto dto) {
        Long userId = Long.parseLong(jwt.getSubject());

        return savedStoryService.saveStory(userId, dto)
            .map(savedStory -> Response.status(Response.Status.CREATED).entity(savedStory).build())
            .onFailure(IllegalArgumentException.class)
            .recoverWithItem(throwable ->
                Response.status(Response.Status.BAD_REQUEST)
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

    @GET
    @RolesAllowed("User")
    public Uni<Response> getUserSavedStories() {
        Long userId = Long.parseLong(jwt.getSubject());

        return savedStoryService.getUserSavedStories(userId)
            .map(stories -> Response.ok(stories).build());
    }

    @GET
    @Path("/{id}")
    @RolesAllowed("User")
    public Uni<Response> getSavedStoryById(@PathParam("id") Long id) {
        return savedStoryService.getSavedStoryById(id)
            .map(savedStory -> Response.ok(savedStory).build())
            .onFailure(EntityNotFoundException.class)
            .recoverWithItem(throwable ->
                Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("error", throwable.getMessage()))
                    .build()
            );
    }

    @GET
    @Path("/{id}/story")
    @RolesAllowed("User")
    public Uni<Response> getReconstructedStory(@PathParam("id") Long id) {
        return savedStoryService.reconstructStoryPath(id)
            .map(sentences -> Response.ok(sentences).build())
            .onFailure(EntityNotFoundException.class)
            .recoverWithItem(throwable ->
                Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("error", throwable.getMessage()))
                    .build()
            );
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("User")
    public Uni<Response> deleteSavedStory(@PathParam("id") Long id) {
        Long userId = Long.parseLong(jwt.getSubject());

        return savedStoryService.deleteSavedStory(userId, id)
            .map(ignored -> Response.noContent().build())
            .onFailure(EntityNotFoundException.class)
            .recoverWithItem(throwable ->
                Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("error", throwable.getMessage()))
                    .build()
            )
            .onFailure(SecurityException.class)
            .recoverWithItem(throwable ->
                Response.status(Response.Status.FORBIDDEN)
                    .entity(Map.of("error", throwable.getMessage()))
                    .build()
            );
    }
}
