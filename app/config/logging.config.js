(function () {
  "use strict";

  angular
    .module("app")
    .config(logging);

  logging.$inject = ['$logProvider'];

  function logging($logProvider) {
    $logProvider.debugEnabled(true);
  }

})();