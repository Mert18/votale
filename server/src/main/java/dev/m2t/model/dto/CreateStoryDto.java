package dev.m2t.model.dto;

public class CreateStoryDto {
    private String name;
    private String lang;

    public CreateStoryDto() {}

    public CreateStoryDto(String name, String lang) {
        this.name = name;
        this.lang = lang;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLang() {
        return lang;
    }

    public void setLang(String lang) {
        this.lang = lang;
    }
}