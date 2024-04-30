(function () {
    'use strict';

    angular
        .module('app')
        .factory('LecturerService', LecturerService)

    LecturerService.$inject = ['API', '$q', '$http', '$log', '$localStorage'];

    function LecturerService(API, $q, $http, $log, $localStorage) {

        var service = {
            getLecturers: getLecturers,
            calculateWorkload: calculateWorkload,
        };

        return service;

        function getLecturers() {

            var deferred = $q.defer();

            if (!$localStorage.selectedSession) {
                deferred.reject("Please Select Session Semester");
                return deferred.promise;
            }

            var session = `${$localStorage.selectedSession.slice(0, 4)}/${$localStorage.selectedSession.slice(4, 8)}`;
            var semester = $localStorage.selectedSession.slice(8, 9);

            const url = `${API.URL}entity=pensyarah&session_id=${$localStorage.sessionID}&sesi=${session}&semester=${semester}`;
            $log.debug("Fetching Lecturers: " + url);

            return $http.get(url)
                .then(getLecturersComplete)
                .catch(getLecturersFailed);

            function getLecturersComplete(response) {
                const size = Object.keys(response.data).length;
                if (size == 0) {
                    deferred.reject("Fetch Lecturers Failed");
                }
                else {
                    calculateWorkload(response.data);
                    deferred.resolve(`Fetched Lecturers (${session}-${semester}): ${response.data.length}`);
                }
                return deferred.promise;
            }

            function getLecturersFailed(error) {
                deferred.reject(error);
                return deferred.promise;
            }
        }

        function calculateWorkload(lecturers) {
            let size = lecturers.length;

            const maxStudents = lecturers.reduce((a, b) => a.bil_pelajar > b.bil_pelajar ? a : b).bil_pelajar;           
            const minStudents = lecturers.reduce((a, b) => a.bil_pelajar < b.bil_pelajar ? a : b).bil_pelajar;

            const maxSubjects = lecturers.reduce((a, b) => a.bil_subjek > b.bil_subjek ? a : b).bil_subjek;
            const minSubjects = lecturers.reduce((a, b) => a.bil_subjek < b.bil_subjek ? a : b).bil_subjek;

            const maxSections = lecturers.reduce((a, b) => a.bil_seksyen > b.bil_seksyen ? a : b).bil_seksyen;
            const minSections = lecturers.reduce((a, b) => a.bil_seksyen < b.bil_seksyen ? a : b).bil_seksyen;

            for (var i = 0; i < size; i++) {
                lecturers[i].bil_pelajar_norm = normalize(lecturers[i].bil_pelajar, maxStudents, minStudents);
                lecturers[i].bil_subjek_norm = normalize(lecturers[i].bil_subjek, maxSubjects, minSubjects);
                lecturers[i].bil_seksyen_norm = normalize(lecturers[i].bil_seksyen, maxSections, minSections);
                lecturers[i].sum_normalized = lecturers[i].bil_pelajar_norm + lecturers[i].bil_subjek_norm + lecturers[i].bil_seksyen_norm
            }

            const maxNormalized = lecturers.reduce((a, b) => a.sum_normalized > b.sum_normalized ? a : b).sum_normalized;
            const minNormalized = lecturers.reduce((a, b) => a.sum_normalized < b.sum_normalized ? a : b).sum_normalized;

            for (var i = 0; i < size; i++) {
                lecturers[i].overall_workload = normalize(lecturers[i].sum_normalized, maxNormalized, minNormalized);
            }

            $localStorage.workload = lecturers;

            // var workloadMap = !$localStorage.workloadMap ? new Map() : new Map(JSON.parse($localStorage.workloadMap));
            // workloadMap.set($localStorage.selectedSession, lecturers);
            // $localStorage.workloadMap = JSON.stringify([...workloadMap]);
        }

        function normalize(val, max, min) {
            if (max - min === 0) return 1;
            return (val - min) / (max - min);
        }
    }

}());