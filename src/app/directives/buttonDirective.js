(function () {
    angular.module('bbdApp').directive('disableonrequest', function ($http) {
        return function (scope, element, attrs) {
            scope.$watch(function (asd) {
                return $http.pendingRequests.length > 0;
            }, function (request) {
                element[0].disabled = request ? true : false;
            });
        }
    });
})();
