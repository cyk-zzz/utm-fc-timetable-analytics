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
                .then(checkLogin)
                .catch(loginFail);

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
                    .then(checkLoginAdmin)
                    .catch(loginFail);

                function checkLoginAdmin(response) {
                    if (!Object.keys(response.data).length) {
                        deferred.reject("Login Admin Failed");
                    }
                    else {
                        const data = response.data[0];
                        $localStorage.sessionID = data.session_id;
                        deferred.resolve("Login Admin Successful");
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
            // delete $localStorage.username;
            // delete $localStorage.fullname;
            // delete $localStorage.usertype;
            // delete $localStorage.sessionID;

            $localStorage.$reset();

            return $q.resolve("Log Out Successfully");
        }
    }

}());