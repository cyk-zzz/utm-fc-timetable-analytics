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


    var dashboard = {
      name: 'dashboard',
      url: '/dashboard',
      templateUrl: 'dashboard/dashboard.html',
      // controller: 'DashboardController as dashboard',
    }

    $stateProvider.state(login);
    $stateProvider.state(dashboard);
  }

})();