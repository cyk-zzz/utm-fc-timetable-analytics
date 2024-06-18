(function () {
    "use strict";

    angular
        .module('app')
        .controller('SideNavController', SideNavController)

    SideNavController.$inject = ['AuthService'];

    function SideNavController(AuthService) {
        var vm = this;

        vm.logout = logout;

        function logout(reset = false) {
            AuthService.logout(reset);
        }
    }
})();
