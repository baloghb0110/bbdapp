(function () {
    function freeCtrl($scope, $http, $window, uiCalendarConfig, auth, AppInfos) {
        var evnt = null

        $scope.acceptFree = function () {
            evnt.data.status = "accepted"
            $http.post(AppInfos.baseUrl + "backend/free/update.php", {
                id: evnt.dbid,
                data: JSON.stringify(evnt.data),
            }).then((res) => {
                if (res.data == 1) {
                    evnt.color = "#49824e94"
                    angular.element('#selectedFree').modal('hide')
                    uiCalendarConfig.calendars['myCalendar'].fullCalendar('updateEvent', evnt)
                    evnt = null
                    notify2("top", "right", "", "primary", "animated fadeInRight", "animated fadeOutRight", "Elfogadtad a szabadság kérelmet!", "");
                } else if (res.data == "tokenError") {
                    notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "Hibás a felhasználói tokened vagy lejárt, kérlek lépj be újra!", "");
                } else {
                    console.error("The error is below")
                    console.error(res)
                    notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "HIBA!! Próbáld újra később!", "");
                }
            })
        }

        $scope.declineFree = function () {
            evnt.data.status = "declined"
            $http.post(AppInfos.baseUrl + "backend/free/update.php", {
                id: evnt.dbid,
                data: JSON.stringify(evnt.data),
            }).then((res) => {
                if (res.data == 1) {
                    evnt.color = "#e4606094"
                    angular.element('#selectedFree').modal('hide')
                    uiCalendarConfig.calendars['myCalendar'].fullCalendar('updateEvent', evnt)
                    evnt = null
                    notify2("top", "right", "", "primary", "animated fadeInRight", "animated fadeOutRight", "Elfogadtad a szabadság kérelmet!", "");
                } else if (res.data == "tokenError") {
                    notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "Hibás a felhasználói tokened vagy lejárt, kérlek lépj be újra!", "");
                } else {
                    console.error("The error is below")
                    console.error(res)
                    notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "HIBA!! Próbáld újra később!", "");
                }
            })
        }

        $scope.createFree = function (type) {
            if (type) {
                if ($scope.datestart != undefined && $scope.dateend != undefined) {
                    const startDate = $scope.datestart
                    const endDate = moment(addDays($scope.dateend, 1)).format('YYYY-MM-DD')
                    const desc = $scope.desc
                    const store_data = JSON.parse($window.localStorage.getItem("userData"))

                    var array = {
                        title: store_data.name,
                        start: startDate,
                        end: endDate,
                        data: {
                            comm: desc || "",
                            status: "pending",
                            type: type,
                        },
                        empID: store_data.empid,
                    }

                    $http.post(AppInfos.baseUrl + "backend/free/add.php", {
                        name: store_data.name,
                        start: startDate,
                        end: endDate,
                        data: JSON.stringify({ comm: desc || "", status: "pending", type: type }),
                        empID: store_data.empid,
                    }).then(function (response) {
                        if (response.data >= 1) {
                            notify2("top", "right", "", "primary", "animated fadeInRight", "animated fadeOutRight", "Sikeresen elküldted a kérelmet!", "");

                            array.dbid = response.data
                            $scope.events.push(array);
                            angular.element('#freeCreate').modal('hide') // bezarjuk a modalt
                            document.getElementById('teszta').reset()

                            uiCalendarConfig.calendars['myCalendar'].fullCalendar('addEventSource', $scope.eventSource);
                        } else if (response.data == "tokenError") {
                            notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "Hibás a felhasználói tokened vagy lejárt, kérlek lépj be újra!", "");
                        } else {
                            console.error("The error is below")
                            console.error(response)
                            notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "HIBA!! Próbáld újra később!", "");
                        }
                    });
                } else notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "Dátumok kiválasztása kötelező", "")
            } else notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "Nincs kiválasztva típus!", "")
        }

        $scope.events = []
        // calendar settings

        $scope.fetchedEvent = function (start, end, timezone, callback) {
            var events = [];
            $scope.events.splice(0) // nullazni kell mert akkor valtasnal duplikalodni fog

            $http.post(AppInfos.baseUrl + "backend/free/get.php", {
                start: start.format("YYYY-MM-DD"),
                end: end.format("YYYY-MM-DD"),
            }).then((res) => {
                if (typeof res.data === "object") {
                    angular.forEach(res.data, function (event, key) {
                        event.data = JSON.parse(event.data)
                        let f_color = event.data.status == "accepted" ? "#49824e94" : (event.data.status == "pending" ? "" : "#e4606094")

                        var a = {
                            dbid: event.id,
                            title: event.name,
                            start: event.startDate,
                            end: event.endDate,
                            empID: event.empID,
                            color: f_color,
                            data: event.data
                        }
                        $scope.events.push(a)
                    });

                    callback(events);
                } else if (res.data == "tokenError") {
                    notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "Hibás a felhasználói tokened vagy lejárt, kérlek lépj be újra!", "");
                } else {
                    console.error("The error is below")
                    console.error(res)
                    notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "HIBA!! Próbáld újra később!", "");
                }
            })
        }


        $scope.eventSources = [$scope.events, $scope.fetchedEvent];

        $scope.uiConfig = {
            calendar: {
                lang: 'hu',
                initialDate: "2023-01-10",
                headerToolbar: false,
                editable: true,
                //contentHeight: 850,
                eventLimit: true,
                editable: false,
                views: {
                    month: {
                        eventLimit: 4
                    }
                },
                header: {
                    left: "prev,next today",
                    center: "title",
                    right: ""
                },
                loading: function (load) {

                },
                eventClick: function (event) {
                    evnt = event // frissites miatt kell ez
                    // array index find
                    //var i = $scope.events.findIndex(x => x._id == info._id)
                    //$scope.events.splice(i, 1);
                    $scope.selectModalTitle = event.data.status === "no" ? "Kérelem" : "Részletes adatok"

                    // uiCalendarConfig.calendars['myCalendar'].fullCalendar('updateEvent', event); elv ezzel tudom majd frissíteni 
                    $scope.perm = auth.getUser().permission

                    $scope.selectName = event.title
                    $scope.selectStatus = event.data.status
                    $scope.selectStartDate = event.start.format("YYYY-MM-DD")
                    $scope.selectEndDate = event.end.format("YYYY-MM-DD")
                    $scope.selectDesc = event.data.comm
                    $scope.selectType = event.data.type === "Sz" ? "Szabadság" : "Betegség"
                    angular.element('#selectedFree').modal('show')
                }
            }


        };

        function addDays(date, days) {
            var result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        }
    }

    angular.module('bbdApp').controller('freeCtrl', freeCtrl)
})();

