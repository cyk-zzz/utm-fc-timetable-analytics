
(function () {
    'use strict';

    angular
        .module('app')
        .factory('SessionService', SessionService)

    SessionService.$inject = ['API', '$q', '$http', '$log', '$localStorage', '$state'];

    function SessionService(API, $q, $http, $log, $localStorage, $state) {

        var service = {
            getSessions: getSessions,
            clearSessions: deleteSessions,
            selectSession: selectSession,
        };

        return service;

        function getSessions() {

            var deferred = $q.defer();

            if ($localStorage.sessions) {
                $log.debug("Session Semester Exists")
                return 0;
            }

            const url = `${API.URL}entity=sesisemester`;
            $log.debug("Fetching Session Semester: " + url);

            return $http.get(url)
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

        function deleteSessions() {
            delete $localStorage.selectedSession;
            delete $localStorage.sessions;
        }

        function selectSession(session) {
            $localStorage.selectedSession = session;
        }
    }

}());