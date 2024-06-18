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

        ChartJsProvider.setOptions('doughnut', {
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