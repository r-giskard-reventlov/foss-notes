package uk.co.foundationsedge.fossnotes.domain.notes;

public class NoteNotFoundException extends RuntimeException {
    public NoteNotFoundException(String message) {
        super(message);
    }
}
