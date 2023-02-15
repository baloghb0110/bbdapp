(function () {
    function workAreaCtrl($scope, $http, $q, AppInfos) {
        $scope.earray = []
        $scope.modalInput = {
            areaName: ''
        }

        var getList = function () {
            var deffered = $q.defer()
            var areas

            $http.get(AppInfos.baseUrl + "backend/workarea/list.php").then((res) => {
                areas = res.data.slice()
                deffered.resolve(areas)
            })

            return deffered.promise
        }

        $q.all([getList()]).then((result) => {
            $scope.earray = result[0]
        })

        $scope.addArea = function () {
            $http.post(AppInfos.baseUrl + "backend/workarea/add.php", {
                name: $scope.modalInput.areaName
            }).then((res) => {
                if (typeof res.data == "object") {
                    $scope.earray.push({
                        id: res.data.lastid,
                        name: $scope.modalInput.areaName,
                        status: 'active'
                    })

                    angular.element('#addWorkArea').modal('hide')
                    resetFrom('modalInput')
                    notify2("top", "right", "", "primary", "animated fadeInRight", "animated fadeOutRight", "Sikeresen felvetted az új munkaterületet!", "");
                } else if (res.data == "tokenError") {
                    notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "Hibás a felhasználói tokened vagy lejárt, kérlek lépj be újra!", "");
                } else {
                    console.error("The error is below")
                    console.error(res)
                    notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "HIBA!! Próbáld újra később!", "");
                }
            })
        }

        function resetFrom(formName) {
            angular.forEach($scope[formName], (val, key) => {
                $scope[formName][key] = ''
            })
        }
    }

    angular.module('bbdApp').controller('workAreaCtrl', workAreaCtrl)
})();

