require(['./keycloak', './notes'], function(keycloak, notes) {

    $(document).ready(function() {

        const settings = {
            listNotesButton: $("#btn-list-note svg"),
        }

        const keycloak = new Keycloak({
            url: 'https://www.foundationsedge.co.uk/auth',
            realm: 'personal-server',
            clientId: 'note-app'
        });

        keycloak.init({onLoad: 'login-required', promiseType: 'native',})
            .then(function(something) {
                console.log(something);
            }).catch(function() {
                console.log("broken");
            });

        keycloak.onAuthSuccess = function(what) {
            keycloak.loadUserProfile()
                .then(function(profile) {
                    console.log("logged in", profile.username);
                }).catch(function() {
                    console.log("failed to load profile");
                });
        };

        notes.bind();
        settings.listNotesButton.click();
    });
});