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
      controller: 'LoginController as login',
    }


    var dashboard = {
      name: 'dashboard',
      url: '/dashboard',
      template: '<h1>Coming Soon</h1> ',
    }

    $stateProvider.state(login);
    $stateProvider.state(dashboard);
  }

})();