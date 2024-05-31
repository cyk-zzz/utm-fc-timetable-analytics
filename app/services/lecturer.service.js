(function () {
    "use strict";

    angular.module("app").factory("LecturerService", LecturerService);

    LecturerService.$inject = ["$q", "$log", "$localStorage", "TTMS"];

    function LecturerService($q, $log, $localStorage, TTMS) {
        var service = {

            fetchLecturersSession: fetchLecturersSession,
            fetchLecturersAllSessions: fetchLecturersAllSessions,
            fetchLecturerSubjects: fetchLecturerSubjects,
            fetchLecturerClasses: fetchLecturerClasses,

            calculateWorkload: calculateWorkload,

            getWorkloadMap: getWorkloadMap,
            getCurrentWorkload: getCurrentWorkload,

        };

        return service;

        function fetchLecturersAllSessions() {
            var promises = [];
            var deferred = $q.defer();

            const sessions = $localStorage.sessions;
            const size = sessions.length;
            for (let i = 0; i < size; i++) {
                promises.push(fetchLecturersSession(sessions[i].sesi_semester_id));
            }

            $q.all(promises).then(() => {
                $log.debug(`Fetched All Lecturers in All Sessions`);
                deferred.resolve();
            });

            return deferred.promise;
        }

        function fetchLecturersSession(
            selectedSession = $localStorage.selectedSession
        ) {
            var deferred = $q.defer();

            if (!selectedSession) {
                $log.error(`Please Select Session Semester`);
                deferred.reject();
                return deferred.promise;
            }

            const session = `${selectedSession.slice(0, 4)}/${selectedSession.slice(4, 8)}`;
            const semester = selectedSession.slice(8, 9);

            if (new Map($localStorage.workloadMap).get(selectedSession)) {
                $log.debug(`Lecturers Data (${session}-${semester}) in Cache`);
                deferred.resolve();
                return deferred.promise;
            }

            return TTMS
                .pensyarah($localStorage.sessionID, session, semester)
                .then(getLecturersComplete)
                .catch(getLecturersFailed);

            function getLecturersComplete(response) {
                const size = Object.keys(response.data).length;
                if (size == 0) {
                    $log.error(`Fetch Lecturers (${session}-${semester}) Failed`);
                    deferred.reject();
                } else {
                    // calculateDurationOfClasses(response.data, selectedSession);
                    // calculateWorkload(response.data, selectedSession);
                    let workloadMap = !$localStorage.workloadMap
                        ? new Map()
                        : new Map($localStorage.workloadMap);
                    workloadMap.set(selectedSession, response.data);
                    $localStorage.workloadMap = [...workloadMap];
                    $log.debug(`Fetched Lecturers (${session}-${semester}): ${response.data.length}`);
                    deferred.resolve();
                }
                return deferred.promise;
            }

            function getLecturersFailed(error) {
                deferred.reject(error);
                return deferred.promise;
            }
        }

        function fetchLecturerSubjects(selectedSession = $localStorage.selectedSession) {
            var deferred = $q.defer();

            if (!selectedSession) {
                $log.error(`Please Select Session Semester`);
                deferred.reject();
                return deferred.promise;
            }

            var promises = [];
            var workloadMap = !$localStorage.workloadMap ? new Map() : new Map($localStorage.workloadMap);
            var lecturers = workloadMap.get(selectedSession);

            const session = `${selectedSession.slice(0, 4)}/${selectedSession.slice(4, 8)}`;
            const semester = selectedSession.slice(8, 9);

            const lecturerCount = lecturers.length;

            if (new Map($localStorage.workloadMap).get(selectedSession)) {
                if (lecturers.some(l => l.hasOwnProperty('subjects')) == true) {
                    $log.debug(`All Subjects Of Lecturers (${session}-${semester}) in Cache`);
                    deferred.resolve();
                    return deferred.promise;
                }
            }

            for (let i = 0; i < lecturerCount; i++) {
                const id = lecturers[i].no_pekerja;

                var promise = TTMS.pensyarah_subjek(id).then(getLecturerSubjectsComplete);

                promises.push(promise);

                function getLecturerSubjectsComplete(response) {
                    var subjectSessionSemester = response.data.filter(function (subject) {
                        return subject.sesi == session && subject.semester == semester;
                    });

                    subjectSessionSemester = subjectSessionSemester.map((obj) => ({
                        kod_subjek: obj.kod_subjek,
                        nama_subjek: obj.nama_subjek,
                        seksyen: parseInt(obj.seksyen),
                    }));

                    lecturers[i].subjects = subjectSessionSemester;
                }
            }

            $q.all(promises).then(() => {
                workloadMap.set(selectedSession, lecturers);
                $localStorage.workloadMap = [...workloadMap];
                $log.debug(`Fetched All Subjects Of Lecturers (${session}-${semester})`);
                deferred.resolve();
            });

            return deferred.promise;
        }

        function fetchLecturerClasses(selectedSession = $localStorage.selectedSession) {
            var deferred = $q.defer();

            if (!selectedSession) {
                $log.error(`Please Select Session Semester`);
                deferred.reject();
                return deferred.promise;
            }

            var promises = [];
            var workloadMap = !$localStorage.workloadMap ? new Map() : new Map($localStorage.workloadMap);
            var lecturers = workloadMap.get(selectedSession);

            const session = `${selectedSession.slice(0, 4)}/${selectedSession.slice(4, 8)}`;
            const semester = selectedSession.slice(8, 9);

            const lecturerCount = lecturers.length;

            if (new Map($localStorage.workloadMap).get(selectedSession)) {
                if (lecturers.some(l => l.hasOwnProperty('classes')) == true) {
                    $log.debug(`All Classes Of Lecturers (${session}-${semester}) in Cache`);
                    deferred.resolve();
                    return deferred.promise;
                }
            }

            for (let i = 0; i < lecturerCount; i++) {
                const subjectCount = lecturers[i].subjects.length;
                lecturers[i].classes = [];

                for (let j = 0; j < subjectCount; j++) {
                    const subjectCode = lecturers[i].subjects[j].kod_subjek;
                    const section = lecturers[i].subjects[j].seksyen;

                    var promise = TTMS.jadual_subjek(session, semester, subjectCode, section).then(getLecturerClassesComplete);

                    promises.push(promise);

                    function getLecturerClassesComplete(response) {
                        var subjectTimetable = response.data.map((obj) => ({
                            hari: obj.hari,
                            masa: obj.masa,
                        }));

                        for (var slot = 0; slot < subjectTimetable.length; slot++) {
                            if (
                                subjectTimetable[slot].hari != null &&
                                !isDuplicate(subjectTimetable[slot], lecturers[i].classes)
                            ) {
                                lecturers[i].classes.push(subjectTimetable[slot]);
                            }
                        }

                        function isDuplicate(entry, arr) {
                            return arr.some(
                                (x) => entry.hari == x.hari && entry.masa == x.masa
                            );
                        }
                    }
                }
            }

            $q.all(promises).then(() => {
                workloadMap.set(selectedSession, lecturers);
                $localStorage.workloadMap = [...workloadMap];
                $log.debug(`Fetched All Classes Of Lecturers (${session}-${semester})`);
                deferred.resolve();
            });

            return deferred.promise;
        }

        function calculateWorkload(selectedSession = $localStorage.selectedSession) {
            var promises = [];
            var workloadMap = !$localStorage.workloadMap ? new Map() : new Map($localStorage.workloadMap);
            var lecturers = workloadMap.get(selectedSession);

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
            }

            workloadMap.set(selectedSession, lecturers);
            $localStorage.workloadMap = [...workloadMap];
        }

        function normalize(val, max, min) {
            if (max - val === 0) return 1;
            return (val - min) / max;
        }

        function getWorkloadMap() {
            return new Map($localStorage.workloadMap);
        }

        function getCurrentWorkload() {
            return new Map($localStorage.workloadMap).get(
                $localStorage.selectedSession
            );
        }
    }
})();
