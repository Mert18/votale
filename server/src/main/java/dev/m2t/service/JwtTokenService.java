package dev.m2t.service;

import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.time.Duration;
import java.util.Set;

@ApplicationScoped
public class JwtTokenService {

    @ConfigProperty(name = "mp.jwt.verify.issuer")
    String issuer;

    public String generateToken(Long userId, String email, String name) {
        return Jwt.issuer(issuer)
            .upn(email)
            .subject(userId.toString())
            .claim("name", name)
            .groups(Set.of("User"))
            .expiresIn(Duration.ofDays(30))
            .sign();
    }
}
