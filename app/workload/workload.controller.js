(function () {
    "use strict";

    angular
        .module('app')
        .controller('WorkloadController', WorkloadController)

    WorkloadController.$inject = ['$log', 'WorkloadService'];

    function WorkloadController($log, WorkloadService) {
        var vm = this;

        vm.sortProperty = 'sum_normalized';
        vm.reverseOrder = true;

        vm.viewMode = 'table';

        vm.getLoading = getLoading;
        vm.getWorkload = getWorkload;
        vm.sortBy = sortBy;
        vm.getColorByValue = getColorByValue;

        vm.chartLabels = ['High', 'Medium High', 'Medium Low', 'Low'];
        vm.chartData = getWorkloadSummary;
        vm.chartColors = ['#FF6685', '#FFB70F', '#FFB70F', '#48C78E'];

        // vm.testLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
        // vm.testSeries = ['Series A', 'Series B'];
        // vm.testData = [
        //     [65, 59, 80, 81, 56, 55, 40],
        //     [28, 48, 40, 19, 86, 27, 90]
        // ];

        vm.testLabels = getColumnChartLabel;
        vm.testSeries = ['Normalized Subject', 'Normalized Weekly Class', 'Normalized Students'];
        vm.testData = getColumnChartData;

        vm.topLegend = {
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

        function getColorByValue(value) {
            if (value == null) {
                return '';
            }
            else if (value <= 0.25) {
                return 'is-success'
            }
            else if (value <= 0.75) {
                return 'is-warning'
            }
            return 'is-danger';
        }
    }
})();
