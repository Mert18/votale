package dev.m2t.model;

import io.quarkus.hibernate.reactive.panache.PanacheEntityBase;
import jakarta.persistence.*;

@Entity
public class Sentence extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne
    @JoinColumn(name = "story_id", nullable = false)
    public Story story;

    @Column(name = "sentence_order")
    public Long order;

    public Long votes;

    public String content;
}