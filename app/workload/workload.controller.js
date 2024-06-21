(function () {
    "use strict";

    angular
        .module('app')
        .controller('WorkloadController', WorkloadController)

    WorkloadController.$inject = ['$log', '$filter', 'WorkloadService', 'LecturerService', 'AuthService', 'SessionService'];

    function WorkloadController($log, $filter, WorkloadService, LecturerService, AuthService, SessionService) {
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
            legend: {
                display: true,
                position: 'right',
            },
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

        vm.columnColors = ['#003f5c', '#58508d', '#bc5090', '#ff6361', '#ff6361', '#ffa600'];
        vm.columnLabels = $filter('orderBy')(getWorkload(), this.sortProperty, this.reverseOrder)?.map((x) => { return x.nama });
        vm.columnSeries = ['Normalized Subjects', 'Normalized Weekly Class', 'Normalized Students'];

        vm.columnSubjects = $filter('orderBy')(getWorkload(), this.sortProperty, this.reverseOrder)?.map((x) => { return x.bil_subjek_norm });
        vm.columnWeeklyClasses = $filter('orderBy')(getWorkload(), this.sortProperty, this.reverseOrder)?.map((x) => { return x.weekly_class_norm });
        vm.columnStudents = $filter('orderBy')(getWorkload(), this.sortProperty, this.reverseOrder)?.map((x) => { return x.bil_pelajar_norm });

        vm.columnLegend = {
            legend: {
                display: true,
                position: 'top',
            }
        }

        vm.getAllSessions = SessionService.getAll;
        vm.getSelected = SessionService.getSelected;
        vm.updateSession = updateSession;
        vm.selectSession = selectSession;

        function selectSession(sessionId) {
            if (angular.isDefined(sessionId)) {
                SessionService.select(sessionId);
                LecturerService.fetchSession(false, sessionId)
                    .then(() => LecturerService.fetchSubjects(false, sessionId), AuthService.logout)
                    .then(() => LecturerService.fetchClasses(false, sessionId), AuthService.logout)
                    .then(() => refreshColumnChart(), AuthService.logout)
            } else {
                return SessionService.getSelected();
            }
        }

        function updateSession() {
            LecturerService.update().catch(AuthService.logout);
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

        function sortBy(sortBy) {
            vm.reverseOrder = (vm.sortProperty == sortBy) ?
                vm.reverseOrder = !vm.reverseOrder :
                vm.reverseOrder = false;
            vm.sortProperty = sortBy;

            refreshColumnChart();
        }

        function checkData() {
            SessionService.fetchAll()
                .then(() => LecturerService.fetchAll(), AuthService.logout)
                .catch(AuthService.logout);
        }

        function refreshColumnChart() {
            vm.columnLabels = $filter('orderBy')(WorkloadService?.getWorkload()?.data, vm.sortProperty, vm.reverseOrder).map((x) => { return x.nama });
            vm.columnSubjects = $filter('orderBy')(WorkloadService?.getWorkload()?.data, vm.sortProperty, vm.reverseOrder).map((x) => { return x.bil_subjek_norm });
            vm.columnWeeklyClasses = $filter('orderBy')(WorkloadService?.getWorkload()?.data, vm.sortProperty, vm.reverseOrder).map((x) => { return x.weekly_class_norm });
            vm.columnStudents = $filter('orderBy')(WorkloadService?.getWorkload()?.data, vm.sortProperty, vm.reverseOrder).map((x) => { return x.bil_pelajar_norm });
        }
    }
})();
