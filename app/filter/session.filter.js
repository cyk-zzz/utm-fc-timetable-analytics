(function () {
    "use strict";

    angular
        .module('app')
        .filter('SessionFilter', SessionFilter)

    SessionFilter.$inject = ['$log'];

    function SessionFilter($log) {
        function filter(input) {
            var out = '';

            const session = `${input.slice(0, 4)}/${input.slice(4, 8)}`;
            const semester = input.slice(8, 9);

            out = `${session} - ${semester}`;

            return out;
        }

        return filter;
    }
})();
