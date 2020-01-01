define(["jquery"], function($) {

    return {
        create: function(body, doneFn, failFn) {
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/notes",
                data: body
            }).done(doneFn).fail(failFn);
        },
        del: function() {

        },
        readAll: function(doneFn, failFn) {
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: "/notes"
            }).done(doneFn).fail(failFn);
        },
        read: function(resource, doneFn, failFn) {
           $.ajax({
               type: "GET",
               contentType: "application/json",
               url: resource
           }).done(doneFn).fail(failFn);
        },
        updateContent: function(resource, content, doneFn, failFn) {
            $.ajax({
                type: "PATCH",
                contentType: "application/xml",
                url: resource,
                data: content
            }).done(doneFn).fail(failFn);
        }
    };

});