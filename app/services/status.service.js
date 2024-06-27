
(function () {
    'use strict';

    angular
        .module('app')
        .factory('StatusService', StatusService)

    StatusService.$inject = ['$log', '$localStorage'];

    function StatusService($log, $localStorage) {

        var service = {
            get: get,
            set: set,
        };

        return service;

        function get() {
            return $localStorage.status;
        }

        function set(status = 'Idle') {
            $log.debug(status);
            $localStorage.status = status;
        }
    }

}());