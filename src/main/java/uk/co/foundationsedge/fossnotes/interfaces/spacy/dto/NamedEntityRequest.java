package uk.co.foundationsedge.fossnotes.interfaces.spacy.dto;

public class NamedEntityRequest {
    private final String text;
    private final String language;

    public NamedEntityRequest(String text, String language) {
        this.text = text;
        this.language = language;
    }

    public String getText() {
        return text;
    }

    public String getLanguage() {
        return language;
    }
}
