(function () {
  "use strict";

  angular
    .module("app")
    .config(translate)

  translate.$inject = ['$translateProvider'];

  function translate($translateProvider) {
    $translateProvider.translations('en', {
      TIMETABLE: 'Timetable',
      SPACE: 'Space',
    });

    $translateProvider.translations('ms', {
      TIMETABLE: 'Jadual Waktu',
      SPACE: 'Ruang',
    });
    
    $translateProvider.preferredLanguage('en');
  }
})();