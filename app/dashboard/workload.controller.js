(function () {
    "use strict";

    angular
        .module('app')
        .controller('WorkloadController', WorkloadController)

    WorkloadController.$inject = ['$log', 'LecturerService'];

    function WorkloadController($log, LecturerService) {
        var vm = this;

        vm.getWorkload = getWorkload;
        vm.sortByLecturer = sortByLecturer;
        vm.sortBySubject = sortBySubject;
        vm.sortByWeeklyClasses = sortByWeeklyClasses;
        vm.sortByStudent = sortByStudent;
        vm.sortByOverallWorkload = sortByOverallWorkload;

        function getWorkload() {
            return LecturerService.getCurrentWorkload();
        }

        function sortByLecturer() {
            LecturerService.getCurrentWorkload().sort((a, b) => a.nama.localeCompare(b.nama));
        }

        function sortBySubject() {
            LecturerService.getCurrentWorkload().sort((a, b) => b.bil_subjek - a.bil_subjek);
        }

        function sortByWeeklyClasses() {
            LecturerService.getCurrentWorkload().sort((a, b) => b.weekly_class - a.weekly_class);
        }

        function sortByStudent() {
            LecturerService.getCurrentWorkload().sort((a, b) => b.bil_pelajar - a.bil_pelajar);
        }

        function sortByOverallWorkload() {
            LecturerService.getCurrentWorkload().sort((a, b) => b.overall_workload - a.overall_workload);
        }
    }
})();
