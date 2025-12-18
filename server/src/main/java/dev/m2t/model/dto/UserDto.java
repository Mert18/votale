package dev.m2t.model.dto;

import dev.m2t.model.User;

public class UserDto {
    public Long id;
    public String email;
    public String name;
    public String pictureUrl;

    public UserDto() {}

    public UserDto(User user) {
        this.id = user.id;
        this.email = user.email;
        this.name = user.name;
        this.pictureUrl = user.pictureUrl;
    }
}
