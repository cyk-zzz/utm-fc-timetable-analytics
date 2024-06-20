(function () {
    "use strict";

    angular
        .module('app')
        .filter('TitleCase', TitleCase)

    TitleCase.$inject = ['$log'];

    function TitleCase($log) {
        function filter(input) {
            input = input || '';
            return input.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
        }

        return filter;
    }
})();
