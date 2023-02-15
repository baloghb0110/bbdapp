(function () {
    function storageService() {
        return {
            setData: function (key, value) {
                sessionStorage.setItem(key, JSON.stringify(value))
            },

            getData: function (key) {
                return JSON.parse(sessionStorage.getItem(key))
            }
        }
    }
    angular.module('bbdApp').service('storageService', storageService)
})();