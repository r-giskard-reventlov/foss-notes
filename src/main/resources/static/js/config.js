require.config({
  baseUrl: '/js/modules',
  deps: [
      "main"
  ],
  paths: {
    jquery: "//code.jquery.com/jquery-3.3.1",
    popper: "//cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min",
    bootstrap: "//stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle",
    //quill: "//cdn.quilljs.com/1.0.0/quill",
    summernote: "//cdnjs.cloudflare.com/ajax/libs/summernote/0.8.12/summernote-bs4",
    sha256: "//cdnjs.cloudflare.com/ajax/libs/js-sha256/0.9.0/sha256",
    base64js: "//cdn.jsdelivr.net/npm/base64-js@1.3.0/base64js.min"
  },
  shim: {
    bootstrap: {
      deps: [
        "jquery"
      ]
    }
  }
});