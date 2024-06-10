(function () {
    "use strict";

    angular
        .module('app')
        .controller('WorkloadController', WorkloadController)

    WorkloadController.$inject = ['$log', 'LecturerService'];

    function WorkloadController($log, LecturerService) {
        var vm = this;

        vm.sortProperty = 'nama';
        vm.reverseOrder = false;

        vm.getLoading = getLoading,
        vm.getWorkload = getWorkload;
        vm.sortBy = sortBy;
        vm.getColorByValue = getColorByValue;

        vm.chartLabels = ['High', 'Medium', 'Low'];
        vm.chartData = getSummary;
        vm.chartColors = ['#FF6685', '#FFB70F', '#48C78E'];

        function getSummary(){
            return LecturerService.getWorkloadSummary();
        }

        function getLoading() {
            if (LecturerService.getCurrentWorkload())
                return !LecturerService.getCurrentWorkload().loading;
        }

        function getWorkload() {
            if (LecturerService.getCurrentWorkload())
                return LecturerService.getCurrentWorkload().data;
        }

        function sortBy(sortBy) {
            vm.reverseOrder = (vm.sortProperty == sortBy) ?
                vm.reverseOrder = !vm.reverseOrder :
                vm.reverseOrder = false;
            vm.sortProperty = sortBy;
        }

        function getColorByValue(value) {
            if (value == null) {
                return '';
            }
            else if (value <= 0.333) {
                return 'is-success'
            }
            else if (value <= 0.666) {
                return 'is-warning'
            }
            return 'is-danger';
        }
    }
})();
