package dev.m2t.resource;

import dev.m2t.model.Sentence;
import dev.m2t.service.SentenceService;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;
import java.util.Map;

@Path("/sentences")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SentenceResource {

    @Inject
    SentenceService sentenceService;

    @GET
    public Uni<Map<String, Object>> getSentences(
            @QueryParam("storyId") Long storyId,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size) {

        Uni<List<Sentence>> sentences = sentenceService.getSentences(storyId, page, size);
        Uni<Long> total = sentenceService.countSentences(storyId);

        return Uni.combine().all().unis(sentences, total).asTuple()
                .map(tuple -> Map.of(
                        "sentences", tuple.getItem1(),
                        "total", tuple.getItem2(),
                        "page", page,
                        "size", size
                ));
    }
}