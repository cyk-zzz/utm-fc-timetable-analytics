(function () {
    "use strict";

    angular
        .module('app')
        .controller('LecturerController', LecturerController)

    LecturerController.$inject = ['$filter', 'LecturerService', 'WorkloadService', 'AuthService', 'SessionService'];

    function LecturerController($filter, LecturerService, WorkloadService, AuthService, SessionService) {
        var vm = this;

        vm.select = select;
        vm.getAllName = Array.from(LecturerService.getAll(), ([id, name]) => ({ id, name }))
            .sort(sortName);

        function sortName(a, b) {
            return a.name.localeCompare(b.name)
        }

        vm.getWorkload = WorkloadService.getWorkloadLecturer;
        vm.getColorByValue = WorkloadService.getColorByValue;
        vm.init = init;
        vm.lecturerName = LecturerService.getName;

        function sortSession(a, b) {
            return a.session_id.localeCompare(b.session_id)
        }

        updateLineChart()

        function select(value) {
            if (angular.isDefined(value)) {
                LecturerService.select(value);

            } else {
                return LecturerService.getSelected();
            }

            updateLineChart();
        }

        function init() {
            WorkloadService.loadWorkloadMap()
                .then(() => WorkloadService.loadWorkloadByLecturerMap())
                .then(() => LecturerService.loadLecturerMap())
                .then(() => SessionService.fetchAll())
                .then(() => LecturerService.fetchAll(), AuthService.logout)
        }

        function updateLineChart() {
            var lecturerName = $filter('TitleCase')(vm.lecturerName());

            vm.columnOptions = {
                title: {
                    display: true,
                    text: `${lecturerName}'s Overall Workload Last 10 Semesters`,
                    fontSize: 20,
                },
                showLines: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            min: 0,
                            max: 1,
                            fontSize: 20
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            minRotation: 35,
                            fontSize: 20
                        }
                    }]
                }
            };
            vm.columnLabels = WorkloadService.getWorkloadLecturer()
                ?.sort(sortSession)
                ?.map((x) => { return $filter('SessionFilter')(x.session_id) });

            vm.columnData = WorkloadService.getWorkloadLecturer()
                ?.sort(sortSession)
                ?.map((x) => { return x.overall_workload });

            vm.columnColors = vm.columnData?.map((column) => getColumnColor(column));

            function getColumnColor(value) {
                if (value == null) return '#FFFFFF';
                else if (value <= 0.25) return '#48C78E'
                else if (value <= 0.5) return '#FFDD8F'
                else if (value <= 0.75) return '#FFb70F';
                return '#FF6685';
            }
        }

    };
})();
