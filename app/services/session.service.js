
(function () {
    'use strict';

    angular
        .module('app')
        .factory('SessionService', SessionService)

    SessionService.$inject = ['$q', '$log', '$localStorage', 'TTMS'];

    function SessionService($q, $log, $localStorage, TTMS) {

        var service = {
            fetchAll: fetchAll,
            getAll: getAll,
            getSelected: getSelected,
            deleteAll: deleteAll,
            select: select,
        };

        return service;

        function fetchAll() {

            var removeSemesters = ['200420052', '200520061']

            var deferred = $q.defer();

            if ($localStorage.sessions) {
                deferred.resolve("Session Semester Exists");
                return deferred.promise;
            }

            return TTMS.sesisemester()
                .then(getSessionsComplete)
                .catch(getSessionsFailed);

            function getSessionsComplete(response) {
                const size = Object.keys(response.data).length;
                if (size == 0) {
                    deferred.reject("Fetch Sessions Failed");
                }
                else {
                    const semesters = response.data;
                    const sortedSemesters = semesters
                        .sort((a, b) => b.sesi_semester_id.localeCompare(a.sesi_semester_id))
                        .filter((x) => !removeSemesters.includes(x.sesi_semester_id));

                    $localStorage.sessions = sortedSemesters;
                    select(semesters[0].sesi_semester_id);
                    $log.debug("Fetched Session Semester: " + semesters.length);
                    deferred.resolve("Fetched Session Semester");
                }

                return deferred.promise;
            }

            function getSessionsFailed(error) {
                $log.debug(error);
                deferred.reject();
                return deferred.promise;
            }
        }

        function getAll(lastSession = -1) {
            var sessions = $localStorage?.sessions
                ?.sort((a, b) => b.sesi_semester_id.localeCompare(a.sesi_semester_id))

            if (lastSession >= 0) sessions = sessions.slice(0, lastSession);

            return sessions;
        }

        function getSelected() {
            return $localStorage.selectedSession;
        }

        function deleteAll() {
            delete $localStorage.selectedSession;
            delete $localStorage.sessions;
        }

        function select(session) {
            $localStorage.selectedSession = session;
        }
    }

}());