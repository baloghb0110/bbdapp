(function () {
    function addCtrl($scope, $http, $window, $state, $timeout, Upload, AppInfos) {
        /*$scope.lastName = ""
        $scope.firstName = ""
        $scope.pcode = ""
        $scope.city = ""
        $scope.street = ""
        $scope.state = ""
        $scope.szemnumber = ""
        $scope.adonumber = ""
        $scope.tajnumber = ""
        $scope.phone = ""
        $scope.birthDate = ""
        $scope.email = ""*/

        $scope.hihi = "img1.jpg"

        $scope.variable = 'j.png';

        $timeout(function () {
            $scope.variable = '323996072_576588940494419_1879133431063570778_n.jpg';
        }, 3000);

        $scope.onFileSelect = function (file, errFiles) {
            $scope.errFile = errFiles && errFiles[0];
            if (file) {
                file.upload = Upload.upload({
                    url: AppInfos.baseUrl + 'backend/employee/upload.php',
                    method: 'POST',
                    data: { file: file }
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        $scope.f = file;
                        file.result = response.data;
                    });
                }, function (response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
                });
            }
        }

        setInputFilter(document.getElementById("firstNameLabel"), function (value) {
            return /^[a-z áéúőóüö\s]*$/i.test(value);
        }, "Csak betűket adhatsz meg");

        setInputFilter(document.getElementById("lastNameLabel"), function (value) {
            return /^[a-z áéúőóüö\s]*$/i.test(value);
        }, "Csak betűket adhatsz meg");

        setInputFilter(document.getElementById("cityLabel"), function (value) {
            return /^[a-z áéúőóüö\s]*$/i.test(value);
        }, "Csak betűket adhatsz meg");

        setInputFilter(document.getElementById("pcodeLabel"), function (value) {
            return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 9999);
        }, "Csak pozitív számokat adhatsz meg!\n0-9999\nMaximum 4 karakter hosszú lehet.");

        setInputFilter(document.getElementById("phoneLabel"), function (value) {
            return /^[\d\(\)\-+]*$/.test(value);
        }, "Csak számokat és szimbólumokat tartalmazhat!");

        setInputFilter(document.getElementById("alertphoneLabel"), function (value) {
            return /^[\d\(\)\-+]*$/.test(value);
        }, "Csak számokat és szimbólumokat tartalmazhat!");

        var errorCounter = 0;

        $scope.addUser = function () {
            errorCounter = 0

            if (checkInput($scope.firstName)) {
                $("#firstNameLabel").attr("class", "form-control is-invalid")
            }

            if (checkInput($scope.lastName)) {
                $("#lastNameLabel").attr("class", "form-control is-invalid")
            }

            if (checkInput($scope.szemnumber)) {
                $("#szemnumberLabel").attr("class", "form-control is-invalid")
            }

            if (checkInput($scope.adonumber)) {
                $("#adonumberLabel").attr("class", "form-control is-invalid")
            }

            if (checkInput($scope.tajnumber)) {
                $("#tajnumberLabel").attr("class", "form-control is-invalid")
            }

            if (checkInput($scope.alertname)) {
                $("#alertnameLabel").attr("class", "form-control is-invalid")
            }

            if (checkInput($scope.alertphone)) {
                $("#alertphoneLabel").attr("class", "form-control is-invalid")
            }

            if (checkInput($scope.pos)) {
                $("#posLabel").attr("class", "form-control is-invalid")
            }


            if (errorCounter > 0) {
                notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "A pirosan jelölt mező(k) kitöltése kötelező!", "");
                $http.pendingRequests.length = 0;
                return
            }

            var name = $scope.firstName + " " + $scope.lastName
            var imgName = $scope.f && $scope.f.name || "img1.jpg";

            var temp = {
                pcode: $scope.pcode || "",
                city: $scope.city || "",
                street: $scope.street || "",
                state: $scope.state || "",
                szemnumber: $scope.szemnumber || "",
                adonumber: $scope.adonumber || "",
                tajnumber: $scope.tajnumber || "",
                phone: $scope.phone || "",
                birthdate: $scope.birthDate || "",
                mail: $scope.email || "",
                pos: $scope.pos || "",
                alertName: $scope.alertname || "",
                alertPhone: $scope.alertphone || "",
                avatar: imgName,
            }

            $http.post(AppInfos.baseUrl + "src/backend/employee/add.php", {
                nev: name || "",
                pData: JSON.stringify(temp),
            }).then(function (response) {
                if (response.data == 1) {
                    notify2("top", "right", "", "primary", "animated fadeInRight", "animated fadeOutRight", "Sikeresen rögzítetted az új alkalmazottat.", "");
                    document.getElementById('resetme').reset();
                    // valamiert nullazni kell a scopeokat mert nem teszi meg a reset
                    $scope.lastName = ""
                    $scope.firstName = ""
                    $scope.pcode = ""
                    $scope.city = ""
                    $scope.street = ""
                    $scope.state = ""
                    $scope.szemnumber = ""
                    $scope.adonumber = ""
                    $scope.tajnumber = ""
                    $scope.phone = ""
                    $scope.birthDate = ""
                    $scope.email = ""
                    $scope.pos = ""
                    $scope.alertname = ""
                    $scope.alertphone = ""
                } else if (response.data == "tokenError") {
                    notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "Hibás a felhasználói tokened vagy lejárt, kérlek lépj be újra!", "");
                } else {
                    console.error("The error is below")
                    console.error(response)
                    notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "HIBA!! Próbáld újra később!", "");
                }
            });
        }

        function checkInput(input) {
            if (input == "" || input == null) {
                errorCounter += 1;
                return true;
            }
            else
                return false;
        }
    }
    angular.module('bbdApp').controller('employeeAddCtrl', addCtrl)
})();

