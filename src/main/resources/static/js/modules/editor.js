define(['jquery', 'summernote', './repo', 'bootstrap'], function($, summernote, repo, bootstrap) {

    function init() {
        $('#editor').summernote({
            toolbarContainer: '#toolbar',
            callbacks: {
                onBlur: function() {
                    save();
                }
            }
        });
        saveFn = setInterval(save, 5000);
    }

    function destroyToolbar() {
        $(".note-toolbar").remove();
    }

    function reset() {
        clearInterval(saveFn);
        destroyToolbar();
        content("");
        $('#editor').summernote('destroy');
        init();
    }

    function changes() {
        return $('#editor').summernote('code');
    }

    function focus() {
        return $('#editor').summernote('focus');
    }

    function content(markup) {
        $('#editor').summernote('code', markup);
    }

    function save() {
        const resource = $(".selected-note").data("note-resource");
        const content = $('#editor').summernote("code");

        console.log('sending resource', resource, content);

        repo.updateContent(
            resource,
            content,
            (data) => {
                console.log("saved");
            },
            (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR, textStatus, errorThrown);
            });
    }

    var saveFn;

    const module = {
        reset: reset,
        changes: changes,
        content: content,
        focus: focus
    };

    return module;
});