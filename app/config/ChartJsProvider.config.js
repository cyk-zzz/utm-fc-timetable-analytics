(function () {
    "use strict";

    angular
        .module("app")
        .config(ChartJsProvider);

    ChartJsProvider.$inject = ['ChartJsProvider'];

    function ChartJsProvider(ChartJsProvider) {
        ChartJsProvider.setOptions({
            chartColors: ['#FF5252', '#FF8A80'],
            responsive: true,
            legend: {
                display: true,
                position: 'top',
            }
        });

        // Configure all line charts
        ChartJsProvider.setOptions('line', {
            showLines: false,
            scales: {
                yAxes: [{
                    ticks: {
                        fontSize: 20
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontSize: 20
                    }
                }]
            }
        });
    }

})();