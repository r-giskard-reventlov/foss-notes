package uk.co.foundationsedge.fossnotes.application;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import uk.co.foundationsedge.fossnotes.domain.notes.NoteNotFoundException;
import uk.co.foundationsedge.fossnotes.domain.notes.NoteUpdateException;
import uk.co.foundationsedge.fossnotes.interfaces.api.dto.Note;
import uk.co.foundationsedge.fossnotes.domain.notes.NoteRepository;
import uk.co.foundationsedge.fossnotes.interfaces.api.dto.NoteAndText;
import uk.co.foundationsedge.fossnotes.interfaces.spacy.NamedEntityService;
import uk.co.foundationsedge.fossnotes.interfaces.spacy.dto.NamedEntityItem;

import javax.transaction.Transactional;
import java.net.URI;
import java.security.Principal;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.function.Supplier;

import static java.util.stream.Collectors.toList;

@Service
public class NoteService {

    private final static Logger LOGGER = LoggerFactory.getLogger(NoteService.class);

    private final Supplier<? extends RuntimeException> lookupFailed = () -> new NoteNotFoundException("failed to find note");

    private final NoteRepository noteRepository;
    private final ObjectMapper objectMapper;
    private final NamedEntityService namedEntityService;

    public NoteService(NoteRepository noteRepository, ObjectMapper objectMapper, NamedEntityService namedEntityService) {
        this.noteRepository = noteRepository;
        this.objectMapper = objectMapper;
        this.namedEntityService = namedEntityService;
    }

    public UUID store(Note note, Principal principal) {
        var user = extractUser(principal);
        note.setUser(user);

        var id = UUID.randomUUID();
        note.setId(id);

        noteRepository.save(note);
        return id;
    }

    public Note findById(UUID id) {
        return noteRepository.findById(id).orElseThrow(lookupFailed);
    }

    public Note update(UUID id, Note note) {
        if(!id.equals(note.getId()))
            throw new NoteUpdateException("failed to update note. th id [" + id + "] does not match the note id [" + note.getId() + "]");
        return noteRepository.save(note);
    }

    public void delete(UUID id) {
        noteRepository.deleteById(id);
    }

    public List<uk.co.foundationsedge.fossnotes.domain.notes.Note> findByUserIdOrderByCreated(String userId, URI path) {
        return noteRepository.findByUserOrderByCreated(userId).parallelStream()
                .map(updateNoteUri(path))
                .collect(toList());
    }

    private Function<Note, uk.co.foundationsedge.fossnotes.domain.notes.Note> updateNoteUri(URI path) {
        return n -> uk.co.foundationsedge.fossnotes.domain.notes.Note.from(n, uriFrom(n, path));
    }

    private URI uriFrom(Note note, URI path) {
        return URI.create(path.toString() + "/notes/" + note.getId());
    }

    private String extractUser(Principal principal) {
        return ((KeycloakAuthenticationToken)principal)
                .getAccount()
                .getKeycloakSecurityContext()
                .getIdToken()
                .getSubject();
    }

    @Transactional
    public List<NamedEntityItem> updateNote(UUID id, NoteAndText content, Principal principal) {
        var note = noteRepository.findById(id).orElseThrow(lookupFailed);
        note.setNote(content.getHtml());
        noteRepository.save(note);

        var entities = this.namedEntityService.namedEntitiesFor(content.getText());

        return entities.parallelStream()
                //.filter(e -> Set.of("DATE", "TIME").contains(e.getType()))
                .collect(toList());
    }

//    private List<> potentialDates(List<NamedEntityItem> collect) {
//    }

    private boolean existingHasOps(Note note) {
        try {
            JsonNode existingDelta = objectMapper.readTree(note.getNote());
            return existingDelta.has("ops");
        } catch (JsonProcessingException e) {
            throw new RuntimeException("failed to parse note [" + note.getNote() + "]");
        }

    }

    public List<uk.co.foundationsedge.fossnotes.domain.notes.Note> findByUserIdOrderByUpdated(String userId, URI path) {
        return noteRepository.findByUserOrderByUpdated(userId).parallelStream()
                .map(updateNoteUri(path))
                .collect(toList());
    }
}
