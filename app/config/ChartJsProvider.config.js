(function () {
    "use strict";

    angular
        .module("app")
        .config(ChartJsProvider);

    ChartJsProvider.$inject = ['ChartJsProvider'];

    function ChartJsProvider(ChartJsProvider) {
        ChartJsProvider.setOptions({
            responsive: true,
            // chartColors : [ '#803690', '#4D5360', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
            // chartColors: ['#488f31', '#0083a6', '#de425b'],
        });

        // Configure all bar charts
        ChartJsProvider.setOptions('horizontalBar', {
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true
                }]
            }
        });
    }

})();