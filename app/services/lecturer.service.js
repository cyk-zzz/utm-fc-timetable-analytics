(function () {
    "use strict";

    angular.module("app").factory("LecturerService", LecturerService);

    LecturerService.$inject = ['$q', '$log', '$localStorage', 'TTMS', 'WorkloadService', 'SessionService'];

    function LecturerService($q, $log, $localStorage, TTMS, WorkloadService, SessionService) {
        var service = {

            fetchAll: fetchAll,

            fetchSession: fetchSession,
            fetchSubjects: fetchSubjects,
            fetchClasses: fetchClasses,

            getAll: getAll,
            getSelected: getSelected,
            select: select,
        };

        return service;

        function fetchAll(lastSession = 10) {
            var deferred = $q.defer();

            const session = $localStorage.sessions

            // Fetch All Parallel
            // var promises = [];
            // const size = sessions.length;
            // // for (let i = 0; i < size; i++) {
            // //     promises.push(fetchLecturersSession(sessions[i].sesi_semester_id));
            // // }

            // // $q.all(promises).then(() => {
            // //     $log.debug(`Fetched All Lecturers in All Sessions`);
            // //     deferred.resolve();
            // // });



            // Fetch Chaining
            // sessions
            //     .slice(0, lastSession)
            SessionService.getAll(lastSession)
                .reduce((current, next) => {
                    return current
                        .then(() => fetchSession(next.sesi_semester_id)
                            .then(() => fetchSubjects(next.sesi_semester_id))
                            .then(() => fetchClasses(next.sesi_semester_id))
                        );
                }, $q.all())
                .then(fetchAllSuccess, fetchAllFailed);

            function fetchAllSuccess() {
                $log.debug(`Fetched All Workload in All Sessions (Last ${lastSession})`);
                deferred.resolve();
            }

            function fetchAllFailed() {
                $log.debug(`Fetched Workload Fail`);
                deferred.reject();
            }

            return deferred.promise;
        }

        function fetchSession(
            selectedSession = $localStorage.selectedSession,
            update = false,
        ) {
            var deferred = $q.defer();

            if (!selectedSession) {
                $log.error(`Please Select Session Semester`);
                deferred.reject();
                return deferred.promise;
            }

            const session = `${selectedSession.slice(0, 4)}/${selectedSession.slice(4, 8)}`;
            const semester = selectedSession.slice(8, 9);

            if (new Map($localStorage.workloadMap).get(selectedSession) && update == false) {
                $log.debug(`Lecturers Data (${session}-${semester}) in Cache`);
                deferred.resolve();
                return deferred.promise;
            }

            $log.debug(`Fetching Lecturers (${session}-${semester}) ......`);

            return TTMS
                .pensyarah($localStorage.sessionID, session, semester)
                .then(getLecturersComplete, getLecturersFailed)

            function getLecturersComplete(response) {
                const size = Object.keys(response.data).length;
                if (size == 0) {
                    $log.error(`Fetch Lecturers (${session}-${semester}) Failed`);
                    deferred.reject();
                } else {
                    let workloadMap = !$localStorage.workloadMap ? new Map() : new Map($localStorage.workloadMap);
                    let lecturers = response.data;

                    let lecturerMap = !$localStorage.lecturerMap ? new Map() : new Map($localStorage.lecturerMap);
                    lecturers.forEach((lecturer) => {
                        lecturerMap.set(lecturer.no_pekerja, lecturer.nama);
                    })

                    var obj = {
                        loading: false,
                        data: lecturers,
                    }

                    workloadMap.set(selectedSession, obj);
                    $localStorage.workloadMap = [...workloadMap];
                    $localStorage.lecturerMap = [...lecturerMap];
                    $log.debug(`Fetched Lecturers (${session}-${semester}): ${response.data.length}`);
                    deferred.resolve();
                }
                return deferred.promise;
            }

            function getLecturersFailed() {
                $log.error(`Fetch Lecturers (${session}-${semester}) Failed`);
                deferred.reject();
                return deferred.promise;
            }
        }

        function fetchSubjects(
            selectedSession = $localStorage.selectedSession,
            update = false,
        ) {
            var deferred = $q.defer();

            if (!selectedSession) {
                $log.error(`Please Select Session Semester`);
                deferred.reject();
                return deferred.promise;
            }

            var promises = [];
            var workloadMap = !$localStorage.workloadMap ? new Map() : new Map($localStorage.workloadMap);

            var data = workloadMap.get(selectedSession);
            var lecturers = data.data;

            const session = `${selectedSession.slice(0, 4)}/${selectedSession.slice(4, 8)}`;
            const semester = selectedSession.slice(8, 9);

            const lecturerCount = lecturers.length;

            if (lecturers.some(x => x.hasOwnProperty('subjects')) == true && update == false) {
                $log.debug(`Subjects Of Lecturers (${session}-${semester}) in Cache`);
                deferred.resolve();
                return deferred.promise;
            }

            $log.debug(`Fetching Subjects (${session}-${semester}) ......`);
            data.loading = true;

            for (let i = 0; i < lecturerCount; i++) {
                const id = lecturers[i].no_pekerja;

                var promise = TTMS.pensyarah_subjek(id)
                    .then(getLecturerSubjectsComplete);

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
                data.loading = false;
                workloadMap.set(selectedSession, data);
                $localStorage.workloadMap = [...workloadMap];
                $log.debug(`Fetched Subjects Of Lecturers (${session}-${semester})`);
                deferred.resolve();
            });

            return deferred.promise;
        }

        function fetchClasses(
            selectedSession = $localStorage.selectedSession,
            update = false,
        ) {
            var deferred = $q.defer();

            if (!selectedSession) {
                $log.error(`Please Select Session Semester`);
                deferred.reject();
                return deferred.promise;
            }

            var promises = [];
            var workloadMap = !$localStorage.workloadMap ? new Map() : new Map($localStorage.workloadMap);
            // var lecturers = workloadMap.get(selectedSession);

            var data = workloadMap.get(selectedSession);
            var lecturers = data.data;

            const session = `${selectedSession.slice(0, 4)}/${selectedSession.slice(4, 8)}`;
            const semester = selectedSession.slice(8, 9);

            const lecturerCount = lecturers.length;

            if (lecturers.some(x => x.hasOwnProperty('classes')) == true && update == false) {
                $log.debug(`Classes Of Lecturers (${session}-${semester}) in Cache`);
                deferred.resolve();
                WorkloadService.calculate(selectedSession);
                return deferred.promise;
            }

            $log.debug(`Fetching Classes (${session}-${semester}) ......`);
            data.loading = true;

            for (let i = 0; i < lecturerCount; i++) {
                const subjectCount = lecturers[i].subjects.length;
                lecturers[i].classes = [];

                for (let j = 0; j < subjectCount; j++) {
                    const subjectCode = lecturers[i].subjects[j].kod_subjek;
                    const section = lecturers[i].subjects[j].seksyen;

                    var promise = TTMS.jadual_subjek(session, semester, subjectCode, section)
                        .then(getLecturerClassesComplete)
                        .catch(getLecturerClassesFailed)

                    promises.push(promise);

                    function getLecturerClassesFailed(response) {
                        $log.debug(response.data)
                    }

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
                data.loading = false;
                workloadMap.set(selectedSession, data);
                $localStorage.workloadMap = [...workloadMap];
                $log.debug(`Fetched Classes Of Lecturers (${session}-${semester})`);

                WorkloadService.calculate(selectedSession);
                deferred.resolve();
            });

            return deferred.promise;
        }

        function getAll() {
            let map = new Map($localStorage.lecturerMap);
            let array = Array.from(map, ([id, name]) => ({ id, name }));
            return array;
        }

        function getSelected() {
            return $localStorage.selectedLecturer;
        }

        function select(id) {
            $localStorage.selectedLecturer = id;
        }
    }
})();
