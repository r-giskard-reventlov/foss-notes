package uk.co.foundationsedge.fossnotes.interfaces.ui;

import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import uk.co.foundationsedge.fossnotes.application.NoteService;
import uk.co.foundationsedge.fossnotes.domain.categories.CategoryRepository;

import java.security.Principal;

@Controller
public class UiController {

    private final NoteService noteService;
    private final CategoryRepository categoryRepository;

    public UiController(NoteService noteService, CategoryRepository categoryRepository) {
        this.noteService = noteService;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/")
    public String home() {
        return "home";
    }

    @GetMapping("/ui/notes")
    public String notes() {
        return "notes";
    }


}
