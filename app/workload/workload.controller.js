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
        vm.init = init;

        vm.getLoading = getLoading;
        vm.getWorkload = getWorkload;

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

        vm.columnColors = ['#6666FF', '#FF0000', '#66CC00'];
        vm.columnLabels = $filter('orderBy')(getWorkload(), this.sortProperty, this.reverseOrder)?.map((x) => { return x.nama });
        vm.columnSeries = ['Normalized Subjects', 'Normalized Weekly Class', 'Normalized Students'];

        vm.columnSubjects = $filter('orderBy')(getWorkload(), this.sortProperty, this.reverseOrder)?.map((x) => { return x.bil_subjek_norm });
        vm.columnWeeklyClasses = $filter('orderBy')(getWorkload(), this.sortProperty, this.reverseOrder)?.map((x) => { return x.weekly_classes_norm });
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
        vm.refreshColumnChart = refreshColumnChart;

        function init() {
            init();
        }

        function selectSession(sessionId) {
            if (angular.isDefined(sessionId)) {
                SessionService.select(sessionId);
                getData(sessionId);
            } else {
                return SessionService.getSelected();
            }
        }

        function getData(sessionId) {
            LecturerService.fetchSession(false, sessionId)
                .then(() => LecturerService.fetchSubjects(false, sessionId), AuthService.logout)
                .then(() => LecturerService.fetchClasses(false, sessionId), AuthService.logout)
                .then(() => WorkloadService.calculate(sessionId), AuthService.logout)
                .then(() => refreshColumnChart(), AuthService.logout)
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

        function init() {
            SessionService.fetchAll()
                .then(() => LecturerService.fetchAll(), AuthService.logout)
                .then(() => getData(SessionService.getSelected()))
        }

        function refreshColumnChart() {
            if(vm.viewMode != 'columnChart'){
                return 0;
            }

            vm.columnLabels = $filter('orderBy')(WorkloadService?.getWorkload()?.data, vm.sortProperty, vm.reverseOrder);
            vm.columnLabels =  vm.columnLabels.map((x) => { return x.nama });

            vm.columnSubjects = $filter('orderBy')(WorkloadService?.getWorkload()?.data, vm.sortProperty, vm.reverseOrder);
            vm.columnSubjects = vm.columnSubjects.map((x) => { return x.bil_subjek_norm });

            vm.columnWeeklyClasses = $filter('orderBy')(WorkloadService?.getWorkload()?.data, vm.sortProperty, vm.reverseOrder);
            vm.columnWeeklyClasses = vm.columnWeeklyClasses.map((x) => { return x.weekly_classes_norm });

            vm.columnStudents = $filter('orderBy')(WorkloadService?.getWorkload()?.data, vm.sortProperty, vm.reverseOrder);
            vm.columnStudents = vm.columnStudents.map((x) => { return x.bil_pelajar_norm });
        }
    }
})();
