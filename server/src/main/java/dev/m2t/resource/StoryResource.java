package dev.m2t.resource;

import dev.m2t.model.dto.StoryStatsDTO;
import dev.m2t.service.StoryService;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/stories")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class StoryResource {

    @Inject
    StoryService storyService;

    @GET
    public Uni<List<StoryStatsDTO>> getStoriesWithStats(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size) {

        return storyService.getStoriesWithStats(page, size);
    }

}
