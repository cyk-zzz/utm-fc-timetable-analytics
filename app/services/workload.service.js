(function () {
    "use strict";

    angular.module("app").factory("WorkloadService", WorkloadService);

    WorkloadService.$inject = ['$log', '$localStorage', 'SessionService'];

    function WorkloadService($log, $localStorage, SessionService) {
        var service = {
            calculate: calculate,

            getWorkloadMap: getWorkloadMap,
            getWorkload: getWorkload,
            calculateWorkloadByLecturer: calculateWorkloadByLecturer,

            getWorkloadLecturer: getWorkloadLecturer,
            getColorByValue: getColorByValue,
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
                lecturers[i].weekly_classes = lecturers[i].classes.length;
            }

            const maxWeeklyClasses = lecturers.reduce((a, b) => a.weekly_classes > b.weekly_classes ? a : b).weekly_classes;
            const minWeeklyClasses = 0;

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
                lecturers[i].weekly_classes_norm = normalize(
                    lecturers[i].weekly_classes,
                    maxWeeklyClasses,
                    minWeeklyClasses
                );

                lecturers[i].sum_normalized =
                    lecturers[i].bil_pelajar_norm +
                    lecturers[i].bil_subjek_norm +
                    lecturers[i].weekly_classes_norm;
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
            // calculateColumnChart();
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
                    return x.weekly_classes_norm;
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
            var workloadLecturerMap = !$localStorage.workloadLecturerMap ? new Map() : new Map($localStorage.workloadLecturerMap);
            var workloadSessionMap = !$localStorage.workloadMap ? new Map() : new Map($localStorage.workloadMap);

            lecturerMap.forEach((name, id) => {
                let workloadArray = [];

                // Add Calculated Workload
                workloadSessionMap.forEach((session, sessionId) => {
                    let lecturers = session.data;

                    lecturers.forEach((lecturer) => {

                        if (lecturer.nama == name) {
                            let obj = {
                                session_id: sessionId,
                                subjects: lecturer.bil_subjek,
                                students: lecturer.bil_pelajar,
                                weekly_classes: lecturer.weekly_classes,
                                overall_workload: lecturer.overall_workload,
                            }
                            workloadArray.push(obj);
                        }
                    })
                })

                // Add Workload that is 0
                let AllSessions = sessions.map((x) => { return x.sesi_semester_id });
                let calculatedSessions = workloadArray.map((x) => { return x.session_id });
                let notCalculatedSessions = AllSessions.filter(x => !calculatedSessions.includes(x));
                if (notCalculatedSessions.length > 0) {
                    notCalculatedSessions.forEach((session) => {
                        let obj = {
                            session_id: session,
                            subjects: 0,
                            students: 0,
                            weekly_classes: 0,
                            overall_workload: 0,
                        }
                        workloadArray.push(obj);
                    })
                }

                // Sort by Session Semester
                workloadArray.sort((a, b) => b.session_id.localeCompare(a.session_id));
                workloadLecturerMap.set(id, workloadArray);
            });

            $localStorage.workloadByLecturerMap = [...workloadLecturerMap];
        }

        function getWorkloadMap() {
            return new Map($localStorage.workloadMap);
        }

        function getWorkload(session = $localStorage.selectedSession) {
            return new Map($localStorage.workloadMap).get(session);
        }

        function getWorkloadLecturer(id = $localStorage.selectedLecturer) {
            let workloadLecturerMap = new Map($localStorage.workloadByLecturerMap);
            return workloadLecturerMap.get(Number(id));
        }

        function getColorByValue(value) {
            if (value == null) {
                return '';
            }
            else if (value <= 0.25) {
                return 'is-success is-striped'
            }
            else if (value <= 0.75) {
                return 'is-warning'
            }
            return 'is-danger';
        }
    }
})();
