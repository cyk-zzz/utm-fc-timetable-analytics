(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthService', AuthService)

    AuthService.$inject = ['$q', '$log', '$localStorage', 'TTMS'];

    function AuthService($q, $log, $localStorage, TTMS) {

        var service = {
            login: login,
            logout: logout,
        };

        return service;

        function login(username, password) {
            var deferred = $q.defer();

            return TTMS.login(username, password)
                .then(checkLogin, loginFail);

            function checkLogin(response) {
                if (!Object.keys(response.data).length) {
                    deferred.reject("Login Failed");
                    return deferred.promise;
                }
                else {
                    const data = response.data[0];
                    $log.info(`Logged In as ${data.full_name}`);
                    $localStorage.username = data.login_name;
                    $localStorage.fullname = data.full_name;
                    $localStorage.usertype = data.description;
                    return loginAdmin(data.session_id);
                }
            }

            function loginAdmin(sessionID) {
                return TTMS.login_admin(sessionID)
                    .then(checkLoginAdmin, loginFail);

                function checkLoginAdmin(response) {
                    if (!Object.keys(response.data).length) {
                        $log.debug("Login Admin Failed");
                        deferred.reject();
                    }
                    else {
                        const data = response.data[0];
                        $localStorage.sessionID = data.session_id;
                        $log.debug("Login Admin Successful");
                        deferred.resolve();
                    }
                    return deferred.promise;
                }
            }

            function loginFail(error) {
                deferred.reject(error);
                return deferred.promise;
            }
        }

        function logout() {
            var deferred = $q.defer();

            // delete $localStorage.username;
            // delete $localStorage.fullname;
            // delete $localStorage.usertype;
            // delete $localStorage.sessionID;

            $localStorage.$reset();
            $log.debug("Log Out Successfully");
            deferred.resolve();
            return deferred.promise;
        }
    }

}());