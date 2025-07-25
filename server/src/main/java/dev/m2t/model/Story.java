package dev.m2t.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.reactive.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;

import java.util.List;

@Entity
public class Story extends PanacheEntity {
    public String name;
    public String lang;

    @OneToMany(mappedBy = "story", fetch = FetchType.LAZY)
    @JsonIgnore
    public List<Sentence> sentences;

    public Story() {}

    public Story(String name, String lang) {
        this.name = name;
        this.lang = lang;
    }
}