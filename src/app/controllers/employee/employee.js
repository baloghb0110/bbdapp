(function () {
    function employeeCtrl($scope, $http, $q, $window, $state, AppInfos) {
        $scope.earray = []
        $scope.activeTag = '<span class="badge bg-soft-success text-success">Aktív</span>'
        $scope.inactiveTag = '<span class="badge bg-soft-danger text-danger">Inaktív</span>'

        $scope.add = function () {
            $state.go('dash.adminData.personaldataadd')
        }

        var getList = function () {
            var deffered = $q.defer()
            var employees

            $http.get(AppInfos.baseUrl + "backend/employee/list.php")
                .then(function (response) {
                    employees = response.data.slice()
                    deffered.resolve(employees)
                })
            return deffered.promise
        }

        $q.all([getList()]).then(function (result) {
            $scope.earray = result[0]
            for (var i = 0; i < $scope.earray.length; i++) {
                $scope.earray[i].data = JSON.parse($scope.earray[i].data)
            }
        })

        $scope.selectMember = function (data) {
            $scope.modalData = data
        }

        $scope.deleteMember = function () {
            var d = $scope.modalData

            $http.post(AppInfos.baseUrl + "backend/employee/delete.php", {
                id: d.id
            }).then((res) => {
                if (res.data === "success") {
                    var a = $scope.earray.findIndex(x => x.id == d.id)
                    $scope.earray.splice(a, 1)
                    notify2("top", "right", "", "primary", "animated fadeInRight", "animated fadeOutRight", "Sikeres törlés!", "");
                } else {
                    console.log(res.data)
                    notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "Hiba a törlés közben, nézze meg a konzolt!", "");
                }
            })
        }
    }

    angular.module('bbdApp').controller('employee', employeeCtrl)
})();