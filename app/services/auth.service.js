(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthService', AuthService)

    AuthService.$inject = ['$q', '$log', '$state', '$localStorage', 'TTMS'];

    function AuthService($q, $log, $state, $localStorage, TTMS) {

        var service = {
            login: login,
            logout: logout,
        };

        return service;

        function login(username, password) {
            var deferred = $q.defer();
            $log.debug("Logging in......");
            return TTMS.login(username, password)
                .then(checkLogin, loginFail)

            function checkLogin(response) {
                if (!Object.keys(response.data).length) {
                    $log.debug("Login Fail");
                    deferred.reject();
                    return deferred.promise;
                }
                else if (response.data == null) {
                    $log.debug("Login Fail");
                    deferred.reject();
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
                    .then(checkLoginAdmin, loginFail)

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
                $log.debug("Login Failed");
                deferred.reject();
                return deferred.promise;
            }
        }

        function logout(reset = false) {
            var deferred = $q.defer();

            if (reset == true) {
                $localStorage.$reset();
            }

            delete $localStorage.username;
            delete $localStorage.fullname;
            delete $localStorage.usertype;
            delete $localStorage.sessionID;

            $log.debug("Log Out Successfully");
            $state.go("login");
            deferred.resolve();
            return deferred.promise;
        }
    }

}());