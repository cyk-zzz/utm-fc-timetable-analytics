(function () {
    "use strict";

    angular
        .module('app')
        .controller('LecturerController', LecturerController)

    LecturerController.$inject = ['LecturerService', 'WorkloadService', '$filter'];

    function LecturerController(LecturerService, WorkloadService, $filter) {
        var vm = this;

        vm.select = select;
        vm.getAllName = Array.from(LecturerService.getAll(), ([id, name]) => ({ id, name }))
            .sort((a, b) => { return a.name.localeCompare(b.name) });

        vm.getWorkload = WorkloadService.getWorkloadLecturer;
        vm.getColorByValue = WorkloadService.getColorByValue;
        vm.checkData = checkData;

        vm.testLabels = WorkloadService.getWorkloadLecturer()?.map((x) => { return $filter('SessionFilter')(x.session_id) })
        vm.testSeries = ["Overall Workload"];
        vm.testData = WorkloadService.getWorkloadLecturer()?.map((x) => { return x.overall_workload });
        vm.testOptions = {
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left'
                    },
                    {
                        id: 'y-axis-2',
                        type: 'linear',
                        display: true,
                        position: 'right'
                    }
                ]
            }
        }

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

    };
})();
