(function () {
    "use strict";

    angular
        .module('app')
        .controller('SessionController', SessionController)

    SessionController.$inject = ['$log', '$state', 'AuthService', 'SessionService', 'LecturerService'];

    function SessionController($log, $state, AuthService, SessionService, LecturerService) {
        var vm = this;

        // vm.storage = $localStorage;
        vm.getSessions = getSessions;
        vm.getSelectedSession = getSelectedSession;
        vm.selectedSession = selectedSession;

        function selectedSession(value) {
            if (angular.isDefined(value)) {
                SessionService.selectSession(value);
                LecturerService.fetchLecturersSession()
                    .then(LecturerService.fetchLecturerSubjects)
                    .then(LecturerService.fetchLecturerClasses)
                    .then(LecturerService.calculateWorkload);
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

        function getLecturers(res) {
            LecturerService.getLecturers()
                .then($log.debug, logout)
                .catch(logout);
        }

        function logout() {
            AuthService.logout().then(goToLogoutPage);
        }

        function goToLogoutPage(message) {
            $log.debug(message);
            $state.go("login");
        }
    }
})();
