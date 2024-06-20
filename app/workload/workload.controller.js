(function () {
    "use strict";

    angular
        .module('app')
        .controller('WorkloadController', WorkloadController)

    WorkloadController.$inject = ['$log', 'WorkloadService', 'LecturerService', 'AuthService', 'SessionService'];

    function WorkloadController($log, WorkloadService, LecturerService, AuthService, SessionService) {
        var vm = this;

        vm.sortProperty = 'sum_normalized';
        vm.reverseOrder = true;

        vm.viewMode = 'table';
        vm.checkData = checkData;

        vm.getLoading = getLoading;
        vm.getWorkload = getWorkload;
        vm.sortBy = sortBy;
        vm.getColorByValue = WorkloadService.getColorByValue;

        vm.summaryLabels = ['High', 'Medium High', 'Medium Low', 'Low'];
        vm.summaryData = getWorkloadSummary;
        vm.summaryColors = ['#FF6685', '#FFB70F', '#FFB70F', '#48C78E'];
        vm.summaryOptions = {
            tooltips: {
                callbacks: {
                    label: (item, data) => {
                        let labelName = data.labels[item.index];
                        let total = data.datasets[item.datasetIndex].data.reduce((sum, a) => sum + a, 0);
                        let count = data.datasets[item.datasetIndex].data[item.index];
                        let percent = (count / total) * 100;
                        return `${labelName}: ${Number(percent).toFixed(2)}%`;
                    }
                }
            },
        }

        vm.columnLabels = getColumnChartLabel;
        vm.columnSeries = ['Normalized Subject', 'Normalized Weekly Class', 'Normalized Students'];
        vm.columnData = getColumnChartData;
        vm.columnLegend = {
            legend: {
                display: true,
                position: 'top',
            }
        }

        function getLoading() {
            return !WorkloadService?.getWorkload()?.loading;
        }

        function getWorkload() {
            return WorkloadService?.getWorkload()?.data;
        }

        function getWorkloadSummary() {
            return WorkloadService?.getWorkload()?.summary;
        }

        function getColumnChartData() {
            return WorkloadService?.getWorkload()?.columnChart?.data;
        }

        function getColumnChartLabel() {
            return WorkloadService.getWorkload()?.columnChart?.label;
        }

        function sortBy(sortBy) {
            vm.reverseOrder = (vm.sortProperty == sortBy) ?
                vm.reverseOrder = !vm.reverseOrder :
                vm.reverseOrder = false;
            vm.sortProperty = sortBy;
        }

        function checkData() {
            SessionService.fetchAll()
                .then(() => LecturerService.fetchAll(), AuthService.logout)
                .catch(AuthService.logout);
        }
    }
})();
