package dev.m2t.resource;

import dev.m2t.model.dto.CreateStoryDto;
import dev.m2t.model.dto.StoryStatsDto;
import dev.m2t.service.StoryService;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.Map;

@Path("/stories")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class StoryResource {

    @Inject
    StoryService storyService;

    @GET
    public Uni<List<StoryStatsDto>> getStories() {
        return storyService.getAllStoriesWithStats();
    }

    @POST
    public Uni<Response> createStory(CreateStoryDto createStoryDto) {
        return storyService.createStory(createStoryDto)
                .map(story -> Response.status(Response.Status.CREATED).entity(story).build())
                .onFailure(IllegalArgumentException.class)
                .recoverWithItem(throwable ->
                        Response.status(Response.Status.BAD_REQUEST)
                                .entity(Map.of("error", throwable.getMessage()))
                                .build()
                )
                .onFailure().recoverWithItem(throwable ->
                        Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                                .entity(Map.of("error", "Failed to create story"))
                                .build()
                );
    }

    @GET
    @Path("/{id}")
    public Uni<Response> getStoryById(@PathParam("id") Long id) {
        return storyService.findStoryById(id)
                .map(story -> Response.ok(story).build())
                .onFailure().recoverWithItem(throwable ->
                        Response.status(Response.Status.NOT_FOUND)
                                .entity(Map.of("error", throwable.getMessage()))
                                .build()
                );
    }
}