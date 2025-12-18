package dev.m2t.model;

import io.quarkus.hibernate.reactive.panache.PanacheEntity;
import io.smallrye.mutiny.Uni;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User extends PanacheEntity {

    @Column(unique = true, nullable = false)
    public String googleId;

    @Column(unique = true, nullable = false)
    public String email;

    public String name;

    public String pictureUrl;

    @Column(nullable = false)
    public LocalDateTime createdAt;

    @Column(nullable = false)
    public LocalDateTime lastLoginAt;

    public User() {
        this.createdAt = LocalDateTime.now();
        this.lastLoginAt = LocalDateTime.now();
    }

    // Static finder methods for reactive queries
    public static Uni<User> findByGoogleId(String googleId) {
        return find("googleId", googleId).firstResult();
    }

    public static Uni<User> findByEmail(String email) {
        return find("email", email).firstResult();
    }
}
