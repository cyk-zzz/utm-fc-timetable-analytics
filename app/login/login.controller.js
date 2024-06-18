(function () {
    "use strict";

    angular
        .module('app')
        .controller('LoginController', LoginController)

    LoginController.$inject = ['$log', '$state', 'AuthService', 'SessionService', 'LecturerService'];

    function LoginController($log, $state, AuthService, SessionService, LecturerService) {
        var vm = this;

        vm.username = '';
        vm.password = '';
        vm.loading = false;
        vm.loginStatus = '';

        vm.login = login;
        vm.logout = AuthService.logout;

        function login() {
            vm.loading = true;
            AuthService.login(vm.username, vm.password)
                .then(loginSuccess, loginFail)
                .finally(() => vm.loading = false)

            function loginSuccess() {
                SessionService.fetchAll()
                    .then(() => LecturerService.fetchAll(), AuthService.logout)
                    // .then(() => LecturerService.fetchAllSessions(), AuthService.logout)
                    // .then(() => LecturerService.fetchSubjectsAllSessions(), AuthService.logout)
                    // .then(() => LecturerService.fetchClassesAllSessions(), AuthService.logout)
                    ;

                $state.go("workload");
            }

            function loginFail(){
                vm.loginStatus = "Login Failed";
            }
        }
    }
})();
