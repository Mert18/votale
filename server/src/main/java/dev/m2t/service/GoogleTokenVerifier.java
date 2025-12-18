package dev.m2t.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.Collections;

@ApplicationScoped
public class GoogleTokenVerifier {

    @ConfigProperty(name = "google.client.id")
    String googleClientId;

    private GoogleIdTokenVerifier verifier;

    @PostConstruct
    void init() {
        verifier = new GoogleIdTokenVerifier.Builder(
            new NetHttpTransport(),
            new GsonFactory()
        )
        .setAudience(Collections.singletonList(googleClientId))
        .build();
    }

    public GoogleIdToken.Payload verify(String tokenString) throws Exception {
        GoogleIdToken idToken = verifier.verify(tokenString);
        if (idToken != null) {
            return idToken.getPayload();
        }
        throw new SecurityException("Invalid Google token");
    }
}
