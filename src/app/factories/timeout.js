angular.module('bbdApp').factory('logTimeTaken', [function ($q) {
    return {
        request: (config) => {
            config.timeout = 10000;
            //config.requestTimestamp = new Date().getTime();
            return config;
        },
        response: (response) => {
            response.config.responseTimestamp = new Date().getTime();
            //console.log({config: response.config.url, duration: response.config.responseTimestamp - response.config.requestTimestamp});
            return response;
        },
        requestError: (rejection) => {
            console.log("requestError: ", rejection)
            return $q.reject(rejection);
        },
        responseError: (rejection) => {
            notify2("top", "right", "", "danger", "animated bounceInRight", "animated bounceOutRight", "Nem sikerült a szerverrel való kommunikálás!\nEllenőrizd az internetkapcsolatot és próbáld újra!");
            return $q.reject(rejection);
        },
    };
}]);

angular.module('bbdApp').config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('logTimeTaken');
}]);