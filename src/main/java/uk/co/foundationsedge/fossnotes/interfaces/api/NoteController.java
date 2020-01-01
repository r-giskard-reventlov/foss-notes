package uk.co.foundationsedge.fossnotes.interfaces.api;

import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import uk.co.foundationsedge.fossnotes.application.NoteService;
import uk.co.foundationsedge.fossnotes.interfaces.api.dto.Note;
import uk.co.foundationsedge.fossnotes.interfaces.api.dto.NoteOrder;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @PostMapping("/notes")
    public ResponseEntity<Void> createNote(@RequestBody Note note,
                                           @AuthenticationPrincipal Principal principal,
                                           UriComponentsBuilder uriBuilder) {
        var UUID = this.noteService.store(note, principal);
        var locationHeader =
                uriBuilder.path("/notes/{id}").buildAndExpand(UUID);
        return ResponseEntity.created(locationHeader.toUri()).build();
    }

    @GetMapping("/notes")
    public List<uk.co.foundationsedge.fossnotes.domain.notes.Note> createNote(
            @RequestParam(value = "order", defaultValue = "CREATED") NoteOrder order,
            @AuthenticationPrincipal Principal principal,
            UriComponentsBuilder uriBuilder) {
        var userId = extractUser(principal);
        var notes = switch(order) {
            case CREATED -> noteService.findByUserIdOrderByCreated(userId, uriBuilder.build().toUri());
            case UPDATED -> noteService.findByUserIdOrderByUpdated(userId, uriBuilder.build().toUri());
        };
        return notes;
    }

    @PatchMapping("/notes/{id}")
    public ResponseEntity<Void> createNote(
            @PathVariable("id") UUID id,
            @RequestBody String content,
            @AuthenticationPrincipal Principal principal,
            UriComponentsBuilder uriBuilder) {
        this.noteService.updateNote(id, content, principal);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/notes/{id}")
    public Note createNote(
            @PathVariable("id") UUID id,
            UriComponentsBuilder uriBuilder) {
        var note = this.noteService.findById(id);
        return note;
    }

    @PutMapping("/notes/{id}")
    public Note updateNote(@PathVariable("id") UUID id,
                           @RequestBody Note note) {
        var entity = this.noteService.update(id, note);
        return entity;
    }

    @DeleteMapping("/notes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Void updateNote(@PathVariable("id") UUID id) {
        this.noteService.delete(id);
        return null;
    }

    private String extractUser(Principal principal) {
        return ((KeycloakAuthenticationToken)principal)
                .getAccount()
                .getKeycloakSecurityContext()
                .getIdToken()
                .getSubject();
    }

}
