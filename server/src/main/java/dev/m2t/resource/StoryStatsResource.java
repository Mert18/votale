package dev.m2t.resource;

import dev.m2t.service.StoryStatsService;
import io.smallrye.mutiny.Uni;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Map;

@Path("/api/stats")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class StoryStatsResource {

    @Inject
    StoryStatsService storyStatsService;

    @GET
    @Path("/stories")
    @RolesAllowed("User")
    public Uni<Response> getLatestStoryStats() {
        return storyStatsService.getLatestStats()
            .map(stats -> {
                if (stats == null) {
                    return Response.ok(Map.of(
                        "possibleStoryCount", 0,
                        "calculatedAt", null
                    )).build();
                }
                return Response.ok(stats).build();
            });
    }

    @POST
    @Path("/stories/calculate")
    @RolesAllowed("User")
    public Uni<Response> triggerCalculation() {
        return storyStatsService.calculateAndStoreStoryCount()
            .chain(() -> storyStatsService.getLatestStats())
            .map(stats -> Response.ok(stats).build());
    }
}
