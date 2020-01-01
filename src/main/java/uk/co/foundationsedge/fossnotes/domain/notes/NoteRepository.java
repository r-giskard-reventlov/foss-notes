package uk.co.foundationsedge.fossnotes.domain.notes;

import org.springframework.data.jpa.repository.JpaRepository;
import uk.co.foundationsedge.fossnotes.interfaces.api.dto.Note;


import java.util.List;
import java.util.UUID;

public interface NoteRepository extends JpaRepository<Note, UUID> {

    List<Note> findByUserOrderByCreated(String userId);
    List<Note> findByUserOrderByUpdated(String userId);
}
