package uk.co.foundationsedge.fossnotes.domain.notes;

import java.net.URI;
import java.util.Date;
import java.util.List;

public class Note {

    private URI id;
    private String user;
    private String note;
    private String header;
    private List<String> tags;
    private Date created;

    private Note(URI id, String user, String note, String header, List<String> tags, Date created) {
        this.id = id;
        this.user = user;
        this.note = note;
        this.header = header;
        this.tags = tags;
        this.created = created;
    }

    public static Note from(uk.co.foundationsedge.fossnotes.interfaces.api.dto.Note note, URI id) {
        return new Note(id, note.getUser(), note.getNote(), note.getHeader(), note.getTags(), note.getCreated());
    }

    public URI getId() {
        return id;
    }

    public String getNote() {
        return note;
    }

    public String getHeader() {
        return header;
    }

    public Date getCreated() {
        return created;
    }
}
