(function () {
    "use strict";

    angular
        .module('app')
        .controller('LecturerController', LecturerController)

    LecturerController.$inject = ['LecturerService', 'WorkloadService'];

    function LecturerController(LecturerService, WorkloadService) {
        var vm = this;

        vm.select = select;
        vm.getAllName = Array.from(LecturerService.getAll(), ([id, name]) => ({ id, name }))
            .sort((a, b) => { return a.name.localeCompare(b.name) });

        vm.getWorkload = WorkloadService.getWorkloadLecturer;
        vm.getColorByValue = WorkloadService.getColorByValue;
        vm.checkData = checkData;

        function select(value) {
            if (angular.isDefined(value)) {
                LecturerService.select(value);
            } else {
                return LecturerService.getSelected();
            }
        }

        function checkData() {
            SessionService.fetchAll()
                .then(() => LecturerService.fetchAll(), AuthService.logout)
                .catch(AuthService.logout);
        }
    }
})();
