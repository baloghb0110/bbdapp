(function () {
    function authFactory($http, $q, AppInfos) {
        var user = undefined
        return {
            isValid: function (token) {
                var deffered = $q.defer()

                $http.post(AppInfos.baseUrl + "backend/auth/auth.php", {
                    token: token
                }).then(function (res) {
                    deffered.resolve(res.data)
                })

                return deffered.promise
            },

            hasRoleByToken: function (token) {
                var deffered = $q.defer()

                if (user) {
                    return $q.when(user)
                }

                $http.post(AppInfos.baseUrl + "backend/auth/hasRoleByToken.php", {
                    token: token,
                }).then(function (res) {
                    user = res.data
                    deffered.resolve(res.data)
                })

                return deffered.promise
            },

            getUser: function () {
                return user
            }
        }
    }
    angular.module('bbdApp').factory('auth', authFactory)
})();