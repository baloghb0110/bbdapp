(function () {
    function attendanceManageCtrl($scope, $state, $http, AppInfos, attendanceService, ngDialog) {
        if (Object.keys(attendanceService.getAttendace()).length > 0) {
            $scope.activeMember = []
            $scope.memberList = attendanceService.getMembers()

            $scope.attendance = attendanceService.getAttendace()
            $scope.comment = $scope.attendance.comment


            let modalList = []

            $http.get(AppInfos.baseUrl + "backend/employee/list.php")
                .then((res) => {
                    angular.forEach(res.data, (key, val) => {
                        if (key.status === 'active')
                            $scope.activeMember.push({ dbid: key.id, name: key.name })
                    })
                })

            $scope.closeAttendance = function () {
                attendanceService.addComment($scope.comment)
                let data = JSON.parse(localStorage.getItem('userData'))
                let check = attendanceService.checkSignPerm(data.permission)
                if (check[0]) {
                    attendanceService.closeAttendance()
                } else {
                    if (check[1] == 'havePerm') {
                        ngDialog.openConfirm({
                            template: '\
                                    <p><center><h5>Figyelem, nem írta alá mindenki!</h5></center><br>Biztos vagy benne, hogy le szeretnéd zárni?</p>\
                                    <div class="ngdialog-buttons">\
                                        <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">Nem</button>\
                                        <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirmClose()">Létrehozás</button>\
                                    </div>',
                            plain: true,
                            controller: function Ctrl($scope, attendanceService) {
                                $scope.confirmClose = function () {
                                    attendanceService.closeAttendance()
                                    ngDialog.closeAll();
                                };
                                $scope.closeThisDialog = function (i) {
                                    ngDialog.closeAll();
                                }
                            },
                        });
                    }
                }
            }

            $scope.addToList = function (dbid, name) {
                if (modalList.some(item => item.dbid === dbid)) {
                    let index = modalList.findIndex(x => x.dbid == dbid)
                    modalList[index].status = true
                } else {
                    modalList.push({
                        dbid: dbid,
                        name: name,
                        status: true,
                    })
                }
            }

            $scope.removeFromList = function (dbid) {
                let index = modalList.findIndex(x => x.dbid == dbid)
                modalList[index].status = false
            }

            $scope.checkAddedForButton = function (dbid) {
                return modalList.some(item => item.dbid === dbid && item.status == true)
            }

            $scope.listCreate = function () {
                // itt pedig hozza kell adni az ujakat
                angular.forEach(modalList, (val, key) => {
                    if (val.status) {
                        if (!$scope.memberList.some(x => x.dbid.includes(val.dbid))) {
                            attendanceService.addMember(val.dbid, val.name)
                        }
                    } else {
                        attendanceService.deleteMember(val.dbid)
                    }
                })
                attendanceService.updateAttendance().then(() => {
                    notify2("top", "right", "", "primary", "animated fadeInRight", "animated fadeOutRight", "Sikeresen rögzítetted a személyeket!", "");
                    modalList = []
                    $scope.memberList = attendanceService.getMembers()
                })
            }

            $scope.checkAdded = function () {
                modalList = []
                angular.forEach($scope.memberList, (val, key) => {
                    modalList.push({
                        dbid: val.dbid,
                        name: val.name,
                        status: true,
                    })
                })
            }

            $scope.createSign = function (id, type) {
                let data = JSON.parse(localStorage.getItem('userData'))

                if (data.id != id && data.permission != "admin") {
                    notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "Más helyett nincs jogod aláírni!", "")
                    return
                }
                if (type == 'start') {
                    ngDialog.openConfirm({
                        template: '\
                        <p><center>Alulírott, mint munkavállaló ezen jelenléti ív aláírásával kifejezetten kijelentem, hogy megismertem a munkáltató BBD Comtech Kft. kockázatértékelését, részt vettem, elvégeztem és megértettem a munkaterületre és az elvégzendő munkára vonatkozó munka- és tűzvédelmi oktatást, továbbá kijelentem az egyéni védőfelszerelés és munkavégzéshez szükséges védőfelszerelések rendelkezésemre állnak. A munkát az alulírott napon minderre tekintettel felveszem.</center></p>\
                        <div class="ngdialog-buttons">\
                            <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(0)">Elfogadom</button>\
                        </div>',
                        plain: true,
                        controller: function Ctrl($scope) {
                            $scope.closeThisDialog = function () {
                                ngDialog.closeAll();
                                ngDialog.open({
                                    template: 'views/private/dialog/signDialog.html',
                                    controller: dialogCtr,
                                    resolve: {
                                        uId: function () {
                                            return id;
                                        },
                                        type: function () {
                                            return type
                                        }
                                    },
                                    showClose: false,
                                });
                            }
                        },
                    });
                } else {
                    ngDialog.open({
                        template: 'views/private/dialog/signDialog.html',
                        controller: dialogCtr,
                        resolve: {
                            uId: function () {
                                return id;
                            },
                            type: function () {
                                return type
                            }
                        },
                        showClose: false,
                    });
                }
            };

            var dialogCtr = function ($scope, uId, type) {
                $scope.id = uId;

                $scope.done = function (id) {
                    ngDialog.close()
                    if (type == "start")
                        attendanceService.insertStartSign(id, $scope.accept().dataUrl)
                    else // type == "end"
                        attendanceService.insertEndSign(id, $scope.accept().dataUrl)
                    //attenDanceService.setUserStartSignById(id, $scope.accept().dataUrl);
                };
            }

        } else $state.go('dash.home')
    }

    angular.module('bbdApp').controller('attendanceManageCtrl', attendanceManageCtrl)
})();

