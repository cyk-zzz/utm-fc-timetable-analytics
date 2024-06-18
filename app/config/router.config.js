(function () {
  "use strict";

  angular
    .module("app")
    .config(router)

  router.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

  function router($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $urlRouterProvider.otherwise('/login');

    var login = {
      name: 'login',
      url: '/login',
      templateUrl: 'login/login.html',
    }


    var workload = {
      name: 'workload',
      url: '/workload',
      templateUrl: 'workload/workload.html',
      // controller: 'DashboardController as dashboard',
    }

    $stateProvider.state(login);
    $stateProvider.state(workload);
  }

})();