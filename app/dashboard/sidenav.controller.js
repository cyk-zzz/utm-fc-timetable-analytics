(function () {
    "use strict";

    angular
        .module('app')
        .controller('SideNavController', SideNavController)

    SideNavController.$inject = ['$log', '$state', 'AuthService'];

    function SideNavController($log, $state, AuthService) {
        var vm = this;

        vm.logout = logout;

        function logout() {
            AuthService.logout().then(() =>
                $state.go("login")
            );
        }
    }
})();
