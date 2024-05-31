
(function () {
    'use strict';

    angular
        .module('app')
        .factory('SessionService', SessionService)

    SessionService.$inject = ['$q', '$log', '$localStorage', 'TTMS'];

    function SessionService($q, $log, $localStorage, TTMS) {

        var service = {
            fetchSessions: fetchSessions,
            getSessions: getSessions,
            getSelectedSession: getSelectedSession,
            clearSessions: deleteSessions,
            selectSession: selectSession,
        };

        return service;

        function fetchSessions() {

            var deferred = $q.defer();

            if ($localStorage.sessions) {
                deferred.resolve("Session Semester Exists");
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
                    const sessionSemesterList = response.data;
                    sessionSemesterList.sort((a, b) => b.sesi_semester_id.localeCompare(a.sesi_semester_id));
                    $localStorage.sessions = sessionSemesterList;
                    selectSession(sessionSemesterList[0].sesi_semester_id);
                    $log.debug("Fetched Session Semester: " + sessionSemesterList.length);
                    deferred.resolve("Fetched Session Semester");
                }

                return deferred.promise;
            }

            function getSessionsFailed(error) {
                deferred.reject(error);
                return deferred.promise;
            }
        }

        function getSessions() {
            return $localStorage.sessions;
        }

        function getSelectedSession() {
            return $localStorage.selectedSession;
        }

        function deleteSessions() {
            delete $localStorage.selectedSession;
            delete $localStorage.sessions;
        }

        function selectSession(session) {
            $localStorage.selectedSession = session;
        }
    }

}());