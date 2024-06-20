(function () {
    "use strict";

    angular
        .module("app")
        .config(ChartJsProvider);

    ChartJsProvider.$inject = ['ChartJsProvider'];

    function ChartJsProvider(ChartJsProvider) {
        ChartJsProvider.setOptions({
            chartColors: ['#e60049', '#0bb4ff', '#50e991'],
            responsive: true,
            legend: {
                display: true,
                position: 'right',
            },
        });

        // Configure all line charts
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