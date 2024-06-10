(function () {
    "use strict";

    angular
        .module('app')
        .controller('SessionController', SessionController)

    SessionController.$inject = ['$log', '$state', 'AuthService', 'SessionService', 'LecturerService'];

    function SessionController($log, $state, AuthService, SessionService, LecturerService) {
        var vm = this;

        vm.getSessions = getSessions;
        vm.getSelectedSession = getSelectedSession;
        vm.selectedSession = selectedSession;

        function selectedSession(value) {
            if (angular.isDefined(value)) {
                SessionService.selectSession(value);
                LecturerService.fetchLecturersSession(value)
                    .then(() => LecturerService.fetchLecturerSubjects(value), logout)
                    .then(() => LecturerService.fetchLecturerClasses(value), logout)
                    .then(() => LecturerService.calculateWorkload(value), logout);
            } else {
                return SessionService.getSelectedSession();
            }
        }

        function getSessions() {
            return SessionService.getSessions();
        }

        function getSelectedSession() {
            return SessionService.getSelectedSession();
        }

        function logout() {
            AuthService.logout().then(() =>
                $state.go("login")
            );
        }
    }
})();
