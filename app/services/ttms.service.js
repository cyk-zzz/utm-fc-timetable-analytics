
(function () {
    'use strict';

    angular
        .module('app')
        .factory('TTMS', TTMS)

    TTMS.$inject = ['API', '$q', '$http', '$log', '$localStorage'];

    function TTMS(API, $q, $http, $log, $localStorage) {

        var service = {
            login: login,
            login_admin: login_admin,

            sesisemester: sesisemester,

            pensyarah: pensyarah,
            subjek: subjek,
            pelajar: pelajar,

            pensyarah_subjek: pensyarah_subjek,
            pelajar_subjek: pelajar_subjek,

            subjek_seksyen: subjek_seksyen,
            subjek_pelajar: subjek_pelajar,
            subjek_pensyarah: subjek_pensyarah,

            ruang: ruang,
            jadual_ruang: jadual_ruang,
            jadual_subjek: jadual_subjek,

            workloadMap: workloadMap,
            workloadByLecturerMap: workloadByLecturerMap,
            lecturerMap: lecturerMap,
        };

        return service;

        function login(username, password) {
            const url = `${API.URL}entity=authentication&login=${username}&password=${password}`;
            return $http.get(url);
        }

        function login_admin(session_id) {
            const url = `${API.URL_ADMIN}session_id=${session_id}`;
            return $http.get(url);
        }

        function sesisemester() {
            const url = `${API.URL}entity=sesisemester`;
            return $http.get(url);
        }

        function pensyarah(session_id, sesi, semester) {
            const url = `${API.URL}entity=pensyarah&session_id=${session_id}&sesi=${sesi}&semester=${semester}`;
            return $http.get(url);
        }

        function subjek(sesi, semester) {
            const url = `entity=subjek&sesi=${sesi}&semester=${semester}`;
            return $http.get(url);
        }

        function pelajar(session_id, sesi, semester, offset, limit = 100) {
            const url = `${API.URL}entity=pelajar&session_id=${session_id}&sesi=${sesi}&semester=${semester}&limit=${limit}&offset=${offset}`;
            return $http.get(url);
        }

        function pensyarah_subjek(no_pekerja) {
            const url = `${API.URL}entity=pensyarah_subjek&no_pekerja=${no_pekerja}`;
            return $http.get(url);
        }

        function pelajar_subjek(no_matrik) {
            const url = `${API.URL}entity=pelajar_subjek&no_matrik=${no_matrik}`;
            return $http.get(url);
        }

        function subjek_seksyen(sesi, semester) {
            const url = `${API.URL}entity=subjek_seksyen&sesi=${sesi}&semester=${semester}`;
            return $http.get(url);
        }

        function subjek_pelajar(session_id, sesi, semester, kod_subjek, seksyen) {
            const url = `${API.URL}entity=subjek_pelajar&session_id=${session_id}&sesi=${sesi}&semester=${semester}&kod_subjek=${kod_subjek}&seksyen=${seksyen}`;
            return $http.get(url);
        }

        function subjek_pensyarah(kod_subjek, sesi, semester, seksyen) {
            const url = `${API.URL}entity=subjek_pensyarah&kod_subjek=${kod_subjek}&sesi=${sesi}&semester=${semester}&seksyen=${seksyen}`;
            return $http.get(url);
        }

        function ruang(kod_fakulti, kod_ruang_like) {
            const url = `${API.URL}entity=ruang&kod_fakulti=${kod_fakulti}&kod_ruang_like=${kod_ruang_like}`;
            return $http.get(url);
        }

        function jadual_ruang(sesi, semester, kod_ruang) {
            const url = `${API.URL}entity=jadual_ruang&sesi=${sesi}&semester=${semester}&kod_ruang=${kod_ruang}`;
            return $http.get(url);
        }

        function jadual_subjek(sesi, semester, kod_subjek, seksyen) {
            const url = `${API.URL}entity=jadual_subjek&sesi=${sesi}&semester=${semester}&kod_subjek=${kod_subjek}&seksyen=${seksyen}`;
            return $http.get(url);
        }

        function workloadMap(url = `http://127.0.0.1:5500/app/workloadMap.json`) {
            var deferred = $q.defer();

            $http.get(url)
                .then(fetchSuccess, fetchFail)

            function fetchSuccess(response) {
                if (!$localStorage.workloadMap) {
                    $localStorage.workloadMap = new Map(response.data);
                    $log.debug("Loaded Calculated workloadMap.json")
                }
                deferred.resolve();
            }

            function fetchFail(response) {
                $log.debug("Load workloadMap.json Fail");
                deferred.resolve();
            }

            return deferred.promise;
        }

        function workloadByLecturerMap(url = `http://127.0.0.1:5500/app/workloadByLecturerMap.json`) {
            var deferred = $q.defer();

            $http.get(url)
                .then(fetchSuccess, fetchFail)

            function fetchSuccess(response) {
                if (!$localStorage.workloadByLecturerMap) {
                    $localStorage.workloadByLecturerMap = new Map(response.data);
                    $log.debug("Loaded Calculated workloadByLecturerMap.json")
                }
                deferred.resolve();
            }

            function fetchFail(response) {
                $log.debug("Load workloadByLecturerMap.json Fail");
                deferred.resolve();
            }

            return deferred.promise;
        }

        function lecturerMap(url = `http://127.0.0.1:5500/app/lecturerMap.json`) {
            var deferred = $q.defer();

            $http.get(url)
                .then(fetchSuccess, fetchFail)

            function fetchSuccess(response) {
                if (!$localStorage.lecturerMap) {
                    $localStorage.lecturerMap = response.data;
                    $log.debug("Loaded lecturerMap.json")
                }
                deferred.resolve();
            }

            function fetchFail(response) {
                $log.debug("Load lecturerMap.json Fail");
                deferred.resolve();
            }

            return deferred.promise;
        }
    }
}());