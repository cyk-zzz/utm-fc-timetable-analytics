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
                .then(loginSuccess, loginFail)
                .catch(loginFail)
                .finally(() => vm.loading = false)

            function loginSuccess(message) {
                $log.debug(message);

                SessionService.fetchSessions()
                    .then(LecturerService.fetchLecturersAllSessions).catch($log.debug)
                    .then(LecturerService.fetchLecturerSubjects).catch($log.debug)
                    .then(LecturerService.fetchLecturerClasses).catch($log.debug)
                    .then(LecturerService.calculateWorkload);

                // SessionService.getSessions().then(getLecturers);
                $state.go("dashboard");
            }

            function getLecturers(res) {
                LecturerService.fetchLecturersSession()
                    .then($log.debug, logout)
                    .catch(logout);
            }

            function loginFail(message) {
                $log.debug(message);
            }
        }

        function logout(message) {
            if (message) $log.debug(message);
            AuthService.logout().then((message) => {
                $log.debug(message);
                $state.go("login");
            });
        }
    }
})();
