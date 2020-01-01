package uk.co.foundationsedge.fossnotes.interfaces.api.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import com.vladmihalcea.hibernate.type.json.JsonNodeBinaryType;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
//@TypeDef(
//    name = "jsonb",
//    typeClass = JsonBinaryType.class
//)
public class Note {

    @Id
    private UUID id;
    @Column(nullable=false, name="uid")
    private String user;
//    @ElementCollection()
//    @CollectionTable(name = "tags", joinColumns = @JoinColumn(name = "note_id"))
//    @Type(type="jsonb")
//    @Column(columnDefinition = "jsonb")
    private String note;
    @Column
    private String header;
    @ElementCollection
    @CollectionTable(name = "tags", joinColumns = @JoinColumn(name = "note_id"))
    private List<String> tags;
    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date created;
    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date updated;

    public Note(String note) {
        this.note = note;
    }

    public Note() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNote() {
        if(note == null) {
            note = "";
        }
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public String getHeader() {
        return header;
    }

    public void setHeader(String header) {
        this.header = header;
    }

    public Date getUpdated() {
        return updated;
    }

    public void setUpdated(Date updated) {
        this.updated = updated;
    }
}
