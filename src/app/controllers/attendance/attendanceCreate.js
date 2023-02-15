(function () {
    function attendanceCreateCtrl($scope, $http, $q, attendanceService, AppInfos) {
        $scope.earray = []

        var getList = function () {
            var deffered = $q.defer()
            var areas

            $http.get(AppInfos.baseUrl + 'backend/attendance/list.php').then((res) => {
                areas = res.data.slice()
                deffered.resolve(areas)
            })
            return deffered.promise
        }

        $q.all([getList()]).then((result) => {
            $scope.earray = result[0]
        })

        $scope.openAttendance = function (name) {
            let isOpen = checkOpenedAttendance(name)

            isOpen.then((res) => {
                if (res) {
                    notify2("top", "right", "", "warning", "animated fadeInRight", "animated fadeOutRight", "A mai napra már van nyitva jelenléti!", "");
                    return
                } else {
                    let creatorName = JSON.parse(localStorage.getItem("userData")).name
                    attendanceService.createAttendance({ creatorName, name })
                }
            })
        }

        function checkOpenedAttendance(area) {
            let deffered = $q.defer()

            $http.post(AppInfos.baseUrl + 'backend/attendance/isAttendanceOpen.php', {
                name: area
            }).then((res) => {
                if (res.data == 'yes') {
                    deffered.resolve(true)
                } else if (res.data == 'no') {
                    deffered.resolve(false)
                } else if (res.data == "tokenError") {
                    notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "Hibás a felhasználói tokened vagy lejárt, kérlek lépj be újra!", "");
                    deffered.reject(true)
                    return
                } else {
                    console.error("The error is below")
                    console.error(res)
                    notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "HIBA!! Próbáld újra később!", "");
                    deffered.reject(true)
                    return
                }
            })

            return deffered.promise
        }
    }

    angular.module('bbdApp').controller('attendanceCreateCtrl', attendanceCreateCtrl)
})();

