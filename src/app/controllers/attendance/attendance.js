(function () {
    function attendanceCtrl($scope, $element, $window, attendanceService) {
        attendanceService.loadAllOpenAttendance().then((res) => {
            $scope.earray = res
        })

        $scope.selectAttendance = function (dbid) {
            attendanceService.loadAttendaceById(dbid)
        }
    }

    angular.module('bbdApp').controller('attendanceCtrl', attendanceCtrl)
})();

