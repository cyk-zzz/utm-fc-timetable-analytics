(function () {
    "use strict";

    angular
        .module('app')
        .controller('StatusController', StatusController)

    StatusController.$inject = ['StatusService'];

    function StatusController(StatusService) {
        var vm = this;

        vm.loading = StatusService.getLoading;
        vm.get = StatusService.getStatus;
    }
})();
