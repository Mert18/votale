package dev.m2t.model.dto;


public class StoryStatsDto {
    public Long id;
    public String name;
    public String lang;
    public Long sentenceCount;
    public Long totalVotes;

    public StoryStatsDto() {}

    // Constructor for native query results (Object[])
    public StoryStatsDto(Object[] result) {
        this.id = ((Number) result[0]).longValue();
        this.name = (String) result[1];
        this.lang = (String) result[2];
        this.sentenceCount = ((Number) result[3]).longValue();
        this.totalVotes = ((Number) result[4]).longValue();
    }

    // Constructor for JPQL constructor expression
    public StoryStatsDto(Long id, String name, String lang, Long sentenceCount, Long totalVotes) {
        this.id = id;
        this.name = name;
        this.lang = lang;
        this.sentenceCount = sentenceCount != null ? sentenceCount : 0L;
        this.totalVotes = totalVotes != null ? totalVotes : 0L;
    }
}