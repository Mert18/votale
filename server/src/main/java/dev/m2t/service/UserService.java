package dev.m2t.service;

import dev.m2t.model.User;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.hibernate.reactive.mutiny.Mutiny;

import java.time.LocalDateTime;

@ApplicationScoped
public class UserService {

    @Inject
    Mutiny.SessionFactory sf;

    public Uni<User> findOrCreateUser(String googleId, String email, String name, String pictureUrl) {
        return sf.withTransaction((session, transaction) ->
            session.createQuery("SELECT u FROM User u WHERE u.googleId = :googleId", User.class)
                .setParameter("googleId", googleId)
                .getSingleResultOrNull()
                .chain(existingUser -> {
                    if (existingUser == null) {
                        // Create new user
                        User newUser = new User();
                        newUser.googleId = googleId;
                        newUser.email = email;
                        newUser.name = name;
                        newUser.pictureUrl = pictureUrl;
                        return session.persist(newUser).replaceWith(newUser);
                    } else {
                        // Update last login time
                        existingUser.lastLoginAt = LocalDateTime.now();
                        return Uni.createFrom().item(existingUser);
                    }
                })
        );
    }
}
