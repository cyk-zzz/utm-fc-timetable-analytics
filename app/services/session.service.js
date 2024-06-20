
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
                    const sessionSemesterList = response.data;
                    sessionSemesterList.sort((a, b) => b.sesi_semester_id.localeCompare(a.sesi_semester_id));
                    $localStorage.sessions = sessionSemesterList;
                    select(sessionSemesterList[0].sesi_semester_id);
                    $log.debug("Fetched Session Semester: " + sessionSemesterList.length);
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
            return $localStorage?.sessions?.slice(0, lastSession);
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