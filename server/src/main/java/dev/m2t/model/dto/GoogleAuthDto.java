package dev.m2t.model.dto;

public class GoogleAuthDto {
    private String googleToken;

    public GoogleAuthDto() {}

    public GoogleAuthDto(String googleToken) {
        this.googleToken = googleToken;
    }

    public String getGoogleToken() {
        return googleToken;
    }

    public void setGoogleToken(String googleToken) {
        this.googleToken = googleToken;
    }
}
