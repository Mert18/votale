package dev.m2t.resource;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import dev.m2t.model.User;
import dev.m2t.model.dto.AuthResponseDto;
import dev.m2t.model.dto.GoogleAuthDto;
import dev.m2t.model.dto.UserDto;
import dev.m2t.service.GoogleTokenVerifier;
import dev.m2t.service.JwtTokenService;
import dev.m2t.service.UserService;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Map;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    GoogleTokenVerifier googleTokenVerifier;

    @Inject
    UserService userService;

    @Inject
    JwtTokenService jwtTokenService;

    @POST
    @Path("/google")
    public Uni<Response> authenticateWithGoogle(GoogleAuthDto authDto) {
        return Uni.createFrom().item(() -> {
            try {
                GoogleIdToken.Payload payload = googleTokenVerifier.verify(authDto.getGoogleToken());
                String googleId = payload.getSubject();
                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String pictureUrl = (String) payload.get("picture");

                return new Object[] { googleId, email, name, pictureUrl };
            } catch (Exception e) {
                throw new WebApplicationException("Invalid Google token", Response.Status.UNAUTHORIZED);
            }
        })
        .chain(data -> {
            String googleId = (String) data[0];
            String email = (String) data[1];
            String name = (String) data[2];
            String pictureUrl = (String) data[3];

            return userService.findOrCreateUser(googleId, email, name, pictureUrl);
        })
        .map(user -> {
            String token = jwtTokenService.generateToken(user.id, user.email, user.name);
            UserDto userDto = new UserDto(user);
            AuthResponseDto response = new AuthResponseDto(token, userDto);

            return Response.ok(response).build();
        })
        .onFailure().recoverWithItem(throwable ->
            Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(Map.of("error", throwable.getMessage()))
                .build()
        );
    }
}
