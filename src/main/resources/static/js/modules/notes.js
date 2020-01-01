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

    function clickAddHeader() {
        settings.editButton.removeClass("d-none");
        $('.notes').hide('slow');
        $('.editor').hide('slow');
        settings.addHeaderModal.modal({});
    }

    function showAddHeader() {
        settings.headerTextField.focus();
    }

    function hideAddHeader() {
        if(currentlyAddingNote()) {
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
                    console.log(textStatus);
                    const resource = jqXHR.getResponseHeader("location");
                    console.log(resource);
                    const note = appendNote(header, resource);
                    highlightNote(note, 'temp');
                },
                (jqXHR, textStatus, errorThrown) => {
                    console.log(jqXHR, textStatus, errorThrown);
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return false;
                });
        } else {
            $('.notes').show('slow');
            settings.editButton.addClass("d-none");
            $('.editor').show('slow');
        }
    }

    function currentlyAddingNote() {
        // TODO: there must be a way to do this with deferred... this is global state!!
        return $.trim($("#div-add-note").html()) !== '';
    }

    function headerKeyPressed(e) {
        if(e.which == 13) {
            editor.reset();
            const header = settings.headerTextField.val();
            $("#div-add-note").html(header)
            settings.addHeaderModal.modal('hide');
        }
    }

    function displayNote(noteDom, note) {
        if($.trim(note.note)) {
            editor.content(note.note);
        }
    }

    function selectedNote(selectedNote, activate) {
        const activateNote = (activate === undefined ? false : activate);
        editor.reset();
        const resource = selectedNote.data("note-resource");
        repo.read(
            resource,
            (note) => {
                console.log(note);
                $("#div-add-note").html(note.header);
                editor.focus();
                highlightNote(selectedNote, activateNote);
                displayNote(selectedNote, note);
            },
            (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR, textStatus, errorThrown);
            });
    }

    function highlightNote(note, activate) {
        $(".selected-note").removeClass("selected-note");
        const resource = note.data("note-resource");

        // TODO: remove this, only need the slected-note class
        $(".editor").attr("data-note-resource", resource);

        console.log("set selected resource", resource)
        note.addClass("selected-note");

        if(activate !== undefined && activate) {
            $('.notes').hide('slow');
            settings.editButton.removeClass("d-none");
        }
    }

    function appendNote(note, resource) {
        const item = $(`
          <li class="card p-1" data-note-resource="${resource}">
              <div class="small mb-2">${note}</div>
              <div class="text-right">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1024 1024"><path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5c-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1l-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2c17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9l183.7-179.1c5-4.9 8.3-11.3 9.3-18.3c2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7L323.1 772l36.1-210.3l-152.8-149L417.6 382L512 190.7L606.4 382l211.2 30.7l-152.8 148.9z" fill="#626262"/><rect x="0" y="0" width="1024" height="1024" fill="rgba(0, 0, 0, 0)" /></svg>
              </div>
          </li>
        `)
        const noteDom = settings.notesList
          .attr("data-note-resource", note)
          .prepend(item);
        return item;
    }

    function editDone() {
        $(".notes").show('slow');
        settings.editButton.addClass("d-none");
    }

    function store(resource, change) {
        console.log("storing", resource);
        repo.createDelta(
            resource,
            change,
            (data) => {
                console.log("saved: ", change)
            },
            (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR, textStatus, errorThrown);
            });
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
        settings.notesList.on("click", "li", function() {
            selectedNote($(this), true);
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
        },
        currentlyAddingNote: currentlyAddingNote,
        store: store
    };

    return module;
});