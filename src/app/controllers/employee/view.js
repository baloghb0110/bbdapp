(function () {
    function personalviewCtrl($scope, $stateParams) {
        $scope.item
        if ($stateParams.name == null) {
            // akkor itt be kell tolteni a mentesbol
            // ha viszont van akkor a mentest felul kell irni
            $scope.item = loadFromStorage()
        } else {
            $scope.item = {
                name: $stateParams.name,
                table: $stateParams.table
            }
            insertStorage($stateParams.name, $stateParams.table)
        }
    }

    function insertStorage(name, table) {
        var item = {
            name: name,
            table: table,
        }
        localStorage.setItem("adminPersonalView", JSON.stringify(item))
    }

    function loadFromStorage() {
        var store = localStorage.getItem("adminPersonalView")

        return JSON.parse(store)
    }

    angular.module('bbdApp').controller('personalview', personalviewCtrl)
})();