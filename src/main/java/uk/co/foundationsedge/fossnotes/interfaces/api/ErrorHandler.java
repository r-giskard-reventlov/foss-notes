package uk.co.foundationsedge.fossnotes.interfaces.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import uk.co.foundationsedge.fossnotes.domain.notes.NoteNotFoundException;
import uk.co.foundationsedge.fossnotes.domain.notes.NoteUpdateException;

@ControllerAdvice
public class ErrorHandler {

    private final static Logger LOGGER = LoggerFactory.getLogger(ErrorHandler.class);

    @ExceptionHandler(value = {NoteNotFoundException.class, NoteUpdateException.class})
    protected ResponseEntity<Object> handleConflict(RuntimeException e) {
        LOGGER.error("error handling note request", e);
        if(e instanceof NoteNotFoundException) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
