(function () {
    "use strict";

    angular
        .module('app')
        .controller('SessionController', SessionController)

    SessionController.$inject = ['AuthService', 'SessionService', 'LecturerService'];

    function SessionController(AuthService, SessionService, LecturerService) {
        var vm = this;

        vm.getAll = SessionService.getAll;
        vm.getSelected = SessionService.getSelected;
        vm.select = select;

        function select(value) {

            if (angular.isDefined(value)) {
                SessionService.select(value);
                LecturerService.fetchSession(value)
                    .then(() => LecturerService.fetchSubjects(value), AuthService.logout)
                    .then(() => LecturerService.fetchClasses(value), AuthService.logout)
            } else {
                return SessionService.getSelected();
            }
        }
    }
})();
