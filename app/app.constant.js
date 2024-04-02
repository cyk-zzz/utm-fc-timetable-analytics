(function () {
    'use strict';

    angular
        .module('app')
        .constant('API', Api());

    function Api() {
        var BASE_URL = 'http://web.fc.utm.my/ttms';

        var constant = {
            BASE_URL: BASE_URL,
            URL: BASE_URL + '/web_man_webservice_json.cgi?',
            URL_ADMIN: BASE_URL + '/auth-admin.php?'
        }

        return constant;
    }

}());