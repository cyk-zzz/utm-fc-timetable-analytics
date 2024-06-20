(function () {
    "use strict";

    angular
        .module('app')
        .controller('SessionController', SessionController)

    SessionController.$inject = ['AuthService', 'SessionService', 'LecturerService', 'WorkloadService'];

    function SessionController(AuthService, SessionService, LecturerService, WorkloadService) {
        var vm = this;

        vm.getAll = SessionService.getAll;
        vm.getSelected = SessionService.getSelected;
        vm.select = select;
        vm.update = LecturerService.update;
        vm.getLoading = getLoading;

        function select(value) {
            if (angular.isDefined(value)) {
                SessionService.select(value);
                LecturerService.fetchSession(false, value)
                    .then(() => LecturerService.fetchSubjects(false, value), AuthService.logout)
                    .then(() => LecturerService.fetchClasses(false, value), AuthService.logout)
            } else {
                return SessionService.getSelected();
            }
        }

        function getLoading() {
            return WorkloadService?.getWorkload()?.loading;
        }
    }
})();
