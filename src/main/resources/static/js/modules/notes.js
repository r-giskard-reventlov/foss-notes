define(["jquery", "./repo", "./editor", "bootstrap"], function($, repo, editor, bootstrap) {

    const settings = {
        addHeaderButton: $("#btn-add-note svg"),
        listNotesButton: $("#btn-list-note svg"),
        notesContainer: $("#note-list"),
        listNotesByUpdatedButton: $("#btn-recent-note svg"),
        addHeaderModal: $('#modal-header'),
        notesList: $("#note-list"),
        editButton: $("#col-btn-edit"),
        headerTextField: $('#text-header'),
    };

    function toggleLargeEditor() {
        $(".notes").toggleClass("d-none");
        $(".editor").toggleClass("col-7 col-11");
    }

    function clickAddHeader() {
        settings.editButton.removeClass("d-none");
        settings.addHeaderModal.modal({});
    }

    function showAddHeader() {
        settings.headerTextField.focus();
    }

    function hideAddHeader() {

    }

    function headerKeyPressed(e) {
        if(e.which == 13) {
            editor.reset();
            settings.addHeaderModal.modal('hide');
            const header = settings.headerTextField.val();
            const tag = $.trim($("#select-tag").val()) || $.trim($("#text-new-tag").val());
            const tags = []
            tags.push(tag);
            const body = JSON.stringify({
                "header": header,
                "tags": tags
            });

            repo.create(
                body,
                (data, textStatus, jqXHR) => {
                    settings.headerTextField.val("");
                    $('.editor').show('slow');
                    //console.log(textStatus);
                    const resource = jqXHR.getResponseHeader("location");
                    //console.log(resource);
                    const note = appendNote(header, resource);
                    highlightNote(note, 'temp');
                },
                (jqXHR, textStatus, errorThrown) => {
                    console.log(jqXHR, textStatus, errorThrown);
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return false;
                });
        }
    }

    function displayNote(noteDom, note) {
        if($.trim(note.note)) {
            editor.content(note.note);
        }
    }

    function selectedNote(selectedNote, expanded) {
        const expandNote = (expanded === undefined ? false : expanded);
        highlightNote(selectedNote, expandNote);
        editor.reset();
        const resource = selectedNote.data("note-resource");
        repo.read(
            resource,
            (note) => {
                //console.log(note);
                editor.focus();
                displayNote(selectedNote, note);
            },
            (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR, textStatus, errorThrown);
            });
    }

    function highlightNote(note, expanded) {
        $(".selected-note").removeClass("selected-note");
        const resource = note.data("note-resource");

        // TODO: remove this, only need the slected-note class
        $(".editor").attr("data-note-resource", resource);

        console.log("set selected resource", resource)
        note.addClass("selected-note");

        if(expanded !== undefined && expanded) {
            settings.editButton.removeClass("d-none");
            toggleLargeEditor();
        }
    }

    function appendNote(note, resource) {
        const item = $(`
          <li class="note" data-note-resource="${resource}">
              <div class="row no-gutters">
                  <div class="small mb-2 col text-truncate p-1">${note}</div>
                  <div class="col-2 text-right p-1">
                      <svg class="highlight-hidden" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 8 8"><path d="M4 0L3 3H0l2.5 2l-1 3L4 6l2.5 2l-1-3L8 3H5L4 0z" fill="#3f6844"/><rect x="0" y="0" width="8" height="8" fill="rgba(0, 0, 0, 0)" /></svg>
                      <svg class="highlight-hidden" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 8 8"><path d="M3 0c-.55 0-1 .45-1 1H1c-.55 0-1 .45-1 1h7c0-.55-.45-1-1-1H5c0-.55-.45-1-1-1H3zM1 3v4.81c0 .11.08.19.19.19h4.63c.11 0 .19-.08.19-.19V3h-1v3.5c0 .28-.22.5-.5.5s-.5-.22-.5-.5V3h-1v3.5c0 .28-.22.5-.5.5s-.5-.22-.5-.5V3h-1z" fill="#3f6844"/><rect x="0" y="0" width="8" height="8" fill="rgba(0, 0, 0, 0)" /></svg>
                  </div>
                  <div class="col-2 no-gutters">
                      <svg class="full-display" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="100%" height="100%" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2zm4 6h5V7l5 5l-5 5v-4H7v-2z" fill="#3f6844"/><rect x="0" y="0" width="" height="100%" fill="rgba(0, 0, 0, 0)" /></svg>
                  </div>
              </row>
          </li>
        `)
        const noteDom = settings.notesList
          .attr("data-note-resource", note)
          .prepend(item);
        return item;
    }

    function editDone() {
        settings.editButton.addClass("d-none");
        toggleLargeEditor();
    }

    function fetchNotesBy(order, activate) {
        const activateNote = (activate === undefined ? false : activate);
        settings.notesContainer.empty();
        repo.readAll(
            (data, textStatus, jqXHR) => {
                data.forEach((note, ix) => {
                    const noteDom = appendNote(note.header, note.id);
                });
                const firstNote = $('ul#note-list li:first');
                if(firstNote) {
                    selectedNote(firstNote);
                    highlightNote(firstNote, activateNote);
                }
            },
            (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR, textStatus, errorThrown);
            });
    }

    function deleteNote(note) {
        const noteId = note.data("note-resource");
        repo.del(
            noteId,
            (none) => {
               console.log("deleted [" + noteId + "]");
               note.remove();
            },
            (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR, textStatus, errorThrown);
            });
    }

    function bindDom() {
        settings.addHeaderButton.click((event) => {
            clickAddHeader();
        });
        settings.addHeaderModal.on('shown.bs.modal', () => {
            showAddHeader();
        });
        settings.addHeaderModal.on('hide.bs.modal', (e) => {
            hideAddHeader();
        });
        settings.addHeaderModal.keypress((e) => {
            headerKeyPressed(e);
        });
        settings.notesList.on("click", "li", function(e) {
            e.stopPropagation();
            const expanded = false;
            selectedNote($(this), expanded);
        });
        settings.notesList.on("click", ".highlight-hidden", function(e) {
            e.stopPropagation();
            deleteNote($(this).closest("li"));
        });
        settings.notesList.on("click", ".full-display", function(e) {
            e.stopPropagation();
            const expanded = true;
            selectedNote($(this).closest("li"), expanded);
        });
        settings.editButton.click((e) => {
            editDone();
        });
        settings.listNotesButton.click((e) => {
            var activate = false;
            fetchNotesBy("CREATED", activate);
        });
        settings.listNotesByUpdatedButton.click((e) => {
            var activate = false;
            fetchNotesBy("UPDATED", activate);
        });
    }

    const module = {
        bind: function() {
            bindDom();
        }
        //currentlyAddingNote: currentlyAddingNote,
        //store: store
    };

    return module;
});