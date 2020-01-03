define(['jquery', 'summernote', './repo', 'bootstrap'], function($, summernote, repo, bootstrap) {

    function init() {
        $('#editor').summernote({
            toolbarContainer: '#toolbar',
            callbacks: {
                onBlur: function() {
                    save();
                }
            },
            disableResizeEditor: true,
            toolbar: [
              ['style', ['style']],
              ['font', ['bold', 'underline', 'clear']],
              ['fontname', ['fontname']],
              ['color', ['color']],
              ['para', ['ul', 'ol', 'paragraph']],
              ['table', ['table']],
              ['insert', ['link', 'picture', 'video']],
              ['view', ['fullscreen', 'help']],
            ],
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
        const code = $('#editor').summernote("code");

        const v = Array.from($(code).map((ix, p) => {
            const val = $(p).text()
                            .replace("<br>", "")
                            .replace(/<\/?[^>]+(>|$)/g, "");
            return val;
        })).join(" ");

        console.log("sending text", v);

        const content = {
            "html": code,
            "text": v
        }

        repo.updateContent(
            resource,
            JSON.stringify(content),
            (data) => {
                const interests = data.map((entity) => {
                    const interest = `
                        <span class="tag badge badge-success">
                            <span>${entity.text}</span>
                            <a>
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 20"><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15l-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152l2.758 3.15a1.2 1.2 0 0 1 0 1.698z" fill="white"/><rect x="0" y="0" width="20" height="20" fill="rgba(0, 0, 0, 0)" /></svg>
                            </a>
                        </span>
                    `;
                    return interest;
                }).join("&nbsp;");

                if(interests.length >= 0) {
                    $("#hint-bar").html(interests).removeClass("d-none");
                } else {
                    $("#hint-bar").addClass("d-none");
                }

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