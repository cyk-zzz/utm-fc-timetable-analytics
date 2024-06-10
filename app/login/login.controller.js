(function () {
    "use strict";

    angular
        .module('app')
        .controller('LoginController', LoginController)

    LoginController.$inject = ['$log', '$state', 'AuthService', 'SessionService', 'LecturerService'];

    function LoginController($log, $state, AuthService, SessionService, LecturerService) {
        var vm = this;

        vm.username = '';
        vm.password = '';
        vm.loading = false;

        vm.login = login;
        vm.logout = logout;

        function login() {
            vm.loading = true;
            AuthService.login(vm.username, vm.password)
                .then(loginSuccess)
                .finally(() => vm.loading = false)

            function loginSuccess() {
                SessionService.fetchSessions()
                    .then(() => LecturerService.fetchLecturersAllSessions(), logout)
                    .then(() => LecturerService.fetchLecturerSubjectsAllSessions(), logout)
                    .then(() => LecturerService.fetchLecturerClassesAllSessions(), logout)
                    // .then(LecturerService.fetchLecturerSubjectsAllSessions)
                    // .then(LecturerService.fetchLecturerClassesAllSessions)
                    .then(() => LecturerService.calculateWorkload(), logout)
                    ;

                $state.go("dashboard");
            }
        }

        function logout() {
            AuthService.logout().then(() =>
                $state.go("login")
            );
        }
    }
})();
