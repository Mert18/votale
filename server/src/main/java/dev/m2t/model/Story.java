package dev.m2t.model;

import io.quarkus.hibernate.reactive.panache.PanacheEntity;
import jakarta.persistence.Entity;

@Entity
public class Story extends PanacheEntity {
    public String name;
    public String lang;

    public Story() {}

    public Story(String name, String lang) {
        this.name = name;
        this.lang = lang;
    }
}