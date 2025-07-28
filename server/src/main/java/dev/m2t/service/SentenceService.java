package dev.m2t.service;

import dev.m2t.model.Sentence;
import dev.m2t.model.dto.CreateSentenceDto;
import dev.m2t.model.dto.SentenceResponseDto;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.hibernate.reactive.mutiny.Mutiny;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class SentenceService {

    @Inject
    Mutiny.SessionFactory sf;

    @Transactional
    public Uni<Sentence> createSentence(CreateSentenceDto sentenceDto) {
        if(sentenceDto.getPreviousSentenceId() != null) {
            return sf.withTransaction((s, t) ->
                    findSentenceById(s, sentenceDto.getPreviousSentenceId())
                            .chain(sentence -> persistSentence(s, sentenceDto))
            );
        } else {
            return sf.withTransaction((s, t) -> persistSentence(s, sentenceDto));
        }
    }

    private Uni<Sentence> findSentenceById(Mutiny.Session session, Long sentenceId) {
        if (sentenceId == null) {
            return Uni.createFrom().nullItem();
        }

        return session.find(Sentence.class, sentenceId);
    }

    private Uni<Sentence> persistSentence(Mutiny.Session session, CreateSentenceDto dto) {
        Sentence sentence = new Sentence();
        sentence.content = dto.getContent();
        sentence.votes = 0L;
        return session.persist(sentence).map(ignored -> sentence);
    }

    public Uni<List<Sentence>> getFirstSentences() {
        return Sentence.find("previousSentence is null order by random()")
                .page(0, 10)
                .list();
    }

    public Uni<List<SentenceResponseDto>> getNextSentences(Long sentenceId) {
        return Sentence.<Sentence>find("previousSentence.id = ?1 order by votes desc", sentenceId)
                .list()
                .map(sentences -> sentences.stream()
                        .map(SentenceResponseDto::new)
                        .collect(Collectors.toList()));
    }
}