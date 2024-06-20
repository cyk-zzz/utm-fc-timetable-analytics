
(function () {
    'use strict';

    angular
        .module('app')
        .factory('StatusService', StatusService)

    StatusService.$inject = ['$log', '$localStorage'];

    function StatusService($log, $localStorage) {

        var service = {
            getStatus: getStatus,
            setStatus: setStatus,
        };

        return service;

        function getStatus() {
            return $localStorage.status;
        }

        function setStatus(status = 'Idle') {
            $log.debug(status);
            $localStorage.status = status;
        }
    }

}());