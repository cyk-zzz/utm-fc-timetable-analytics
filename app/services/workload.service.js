(function () {
    "use strict";

    angular.module("app").factory("WorkloadService", WorkloadService);

    WorkloadService.$inject = ['$log', '$localStorage', 'SessionService'];

    function WorkloadService($log, $localStorage, SessionService) {
        var service = {
            calculate: calculate,

            getWorkloadMap: getWorkloadMap,
            getWorkload: getWorkload,
        };

        return service;

        function calculate(selectedSession = $localStorage.selectedSession) {
            var workloadMap = !$localStorage.workloadMap ? new Map() : new Map($localStorage.workloadMap);

            var data = workloadMap.get(selectedSession);
            var lecturers = data.data;
            var workloadSummary = [0, 0, 0, 0];
            let size = lecturers.length;

            const maxStudents = lecturers.reduce((a, b) => a.bil_pelajar > b.bil_pelajar ? a : b).bil_pelajar;
            const minStudents = 0;

            const maxSubjects = lecturers.reduce((a, b) => a.bil_subjek > b.bil_subjek ? a : b).bil_subjek;
            const minSubjects = 0;

            for (var i = 0; i < size; i++) {
                lecturers[i].weekly_class = lecturers[i].classes.length;
            }

            const maxWeeklyClass = lecturers.reduce((a, b) => a.weekly_class > b.weekly_class ? a : b).weekly_class;
            const minWeeklyClass = 0;

            // const maxSections = lecturers.reduce((a, b) =>a.bil_seksyen > b.bil_seksyen ? a : b).bil_seksyen;
            // const minSections = lecturers.reduce((a, b) => a.bil_seksyen < b.bil_seksyen ? a : b).bil_seksyen;
            // const minSections = 0;

            for (var i = 0; i < size; i++) {
                lecturers[i].bil_pelajar_norm = normalize(
                    lecturers[i].bil_pelajar,
                    maxStudents,
                    minStudents
                );
                lecturers[i].bil_subjek_norm = normalize(
                    lecturers[i].bil_subjek,
                    maxSubjects,
                    minSubjects
                );
                lecturers[i].weekly_class_norm = normalize(
                    lecturers[i].weekly_class,
                    maxWeeklyClass,
                    minWeeklyClass
                );

                lecturers[i].sum_normalized =
                    lecturers[i].bil_pelajar_norm +
                    lecturers[i].bil_subjek_norm +
                    lecturers[i].weekly_class_norm;
            }

            const maxNormalized = lecturers.reduce((a, b) => a.sum_normalized > b.sum_normalized ? a : b).sum_normalized;
            const minNormalized = 0;

            for (var i = 0; i < size; i++) {
                lecturers[i].overall_workload = normalize(
                    lecturers[i].sum_normalized,
                    maxNormalized,
                    minNormalized
                );

                if (lecturers[i].overall_workload <= 0.25) {
                    workloadSummary[3]++;
                }
                else if (lecturers[i].overall_workload <= 0.5) {
                    workloadSummary[2]++;
                }
                else if (lecturers[i].overall_workload <= 0.75) {
                    workloadSummary[1]++;
                }
                else {
                    workloadSummary[0]++;
                }
            }

            data.loading = false;
            data.summary = workloadSummary;
            workloadMap.set(selectedSession, data);
            $localStorage.workloadMap = [...workloadMap];
            // $localStorage.workloadSummary = workloadSummary;

            calculateColumnChart();
        }

        function calculateColumnChart(selectedSession = $localStorage.selectedSession) {
            var workloadMap = !$localStorage.workloadMap ? new Map() : new Map($localStorage.workloadMap);
            var data = workloadMap.get(selectedSession);
            var lecturers = data.data;

            const sortedLecturers = lecturers
                .sort((a, b) => { return b.sum_normalized - a.sum_normalized })

            const lecturersLabel = sortedLecturers
                .map((x) => {
                    return x.nama;
                });

            const subjects = sortedLecturers
                .map((x) => {
                    return x.bil_subjek_norm;
                });

            const weeklyClass = sortedLecturers
                .map((x) => {
                    return x.weekly_class_norm;
                });

            const students = sortedLecturers
                .map((x) => {
                    return x.bil_pelajar_norm;
                });

            data.columnChart = {
                label: lecturersLabel,
                data: [subjects, weeklyClass, students]
            }

            workloadMap.set(selectedSession, data);
            $localStorage.workloadMap = [...workloadMap];
        }

        function normalize(val, max, min) {
            if (max - val === 0) return 1;
            let result = (val - min) / max
            result = parseFloat(result.toFixed(3));
            return result;
        }

        function calculateWorkloadByLecturer(lastSession = -1) {

            var sessions = SessionService.getAll(lastSession);

            var lecturerMap = !$localStorage.lecturerMap ? new Map() : new Map($localStorage.lecturerMap);

            var workloadMap = !$localStorage.workloadMap ? new Map() : new Map($localStorage.workloadMap);

            var workloadByLecturerMap = !$localStorage.workloadMap ? new Map() : new Map($localStorage.workloadMap);

            $localStorage.workloadByLecturerMap = [...workloadByLecturerMap];
        }

        function getWorkloadMap() {
            return new Map($localStorage.workloadMap);
        }

        function getWorkload(session = $localStorage.selectedSession) {
            return new Map($localStorage.workloadMap).get(session);
        }
    }
})();
