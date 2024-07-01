(function () {
    'use strict';

    angular
        .module('app')
        .constant('API', Api())
        .constant('COLOR', Color());

    function Api() {
        var BASE_URL = 'http://web.fc.utm.my/ttms';

        var constant = {
            BASE_URL: BASE_URL,
            URL: BASE_URL + '/web_man_webservice_json.cgi?',
            URL_ADMIN: BASE_URL + '/auth-admin.php?'
        }

        return constant;
    }

    function Color(){
        var constant = {
            LOW: '#48C78E',
            MEDIUM_LOW: '#FFDD8F',
            MEDIUM_HIGH: '#FFb70F',
            HIGH: '#FF6685'
        }

        return constant
    }

}());