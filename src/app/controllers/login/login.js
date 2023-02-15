(function () {
    function loginCtrl($scope, $http, $window, $state, AppInfos) {

        $scope.login = function () {
            if ($scope.username == null && $scope.password == null) {
                notify2("top", "right", "", "warning", "animated fadeInRight", "animated fadeOutRight", "A mezők kitöltése kötelező!", "");
                return
            }

            $http.post(AppInfos.baseUrl + "backend/login/login.php", {
                username: $scope.username,
                password: $scope.password
            }).then(function (res) {
                if (res.data == "disabled") {
                    notify2("top", "right", "", "warning", "animated fadeInRight", "animated fadeOutRight", "Ez a fiók fel van függesztve.", "");
                    return
                }
                else if (res.data == 'no') {
                    notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "Hibás név vagy jelszó!", "");
                    return
                }
                if (typeof (res.data) === "object") {
                    $window.localStorage.setItem('token', res.data.token);
                    var inform = {
                        id: res.data.id,
                        username: res.data.username,
                        permission: res.data.permission,
                        empid: res.data.empID,
                        name: res.data.name,
                    }
                    $window.localStorage.setItem('userData', JSON.stringify(inform))

                    notify2("top", "right", "", "primary", "animated fadeInRight", "animated fadeOutRight", "Sikeres bejelentkezés.", "");
                    $state.go("dash.home")
                } else {
                    notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "Hiba történt a backendben, részletek a logban!", "");
                    console.log(res)
                }
            })
        }
    }

    angular.module('bbdApp').controller('loginCtrl', loginCtrl)
})();

