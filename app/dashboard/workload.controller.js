(function () {
    "use strict";

    angular
        .module('app')
        .controller('WorkloadController', WorkloadController)

    WorkloadController.$inject = ['$log', '$localStorage', 'LecturerService', 'SessionService'];

    function WorkloadController($log, $localStorage, LecturerService, SessionService) {
        var vm = this;

        vm.getWorkload = getWorkload;
        vm.sortByLecturer = sortByLecturer;
        vm.sortBySubject = sortBySubject;
        vm.sortBySection = sortBySection;
        vm.sortByStudent = sortByStudent;
        vm.sortByOverallWorkload = sortByOverallWorkload;

        function getWorkload() {
            return $localStorage.workload;
        }

        function sortByLecturer() {
            $localStorage.workload.sort((a, b) => a.nama.localeCompare(b.nama));
        }

        function sortBySubject() {
            $localStorage.workload.sort((a, b) => b.bil_subjek - a.bil_subjek);
        }

        function sortBySection() {
            $localStorage.workload.sort((a, b) => b.bil_seksyen - a.bil_seksyen);
        }

        function sortByStudent() {
            $localStorage.workload.sort((a, b) => b.bil_pelajar - a.bil_pelajar);
        }

        function sortByOverallWorkload() {
            $localStorage.workload.sort((a, b) => b.overall_workload - a.overall_workload);
        }
    }
})();
