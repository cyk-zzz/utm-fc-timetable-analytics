(function () {
    "use strict";

    angular
        .module('app')
        .controller('SessionController', SessionController)

    SessionController.$inject = ['$log', '$localStorage', '$state', 'AuthService', 'SessionService', 'LecturerService'];

    function SessionController($log, $localStorage, $state, AuthService, SessionService, LecturerService) {
        var vm = this;

        // vm.storage = $localStorage;
        vm.getSessions = getSessions;
        vm.getSelectedSession = getSelectedSession;
        vm.selectedSession = selectedSession;

        function selectedSession(value) {
            if (angular.isDefined(value)) {
                SessionService.selectSession(value);
                getLecturers();
            } else {
                return $localStorage.selectedSession;
            }
        }

        function getSessions() {
            return $localStorage.sessions;
        }

        function getSelectedSession() {
            return $localStorage.selectedSession;
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
