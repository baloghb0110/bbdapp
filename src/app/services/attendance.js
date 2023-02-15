(function () {
    function attendanceServiceCtrl($http, $state, $q, AppInfos) {
        var attendance = {}
        var members = []

        function padTo2Digits(num) {
            return num.toString().padStart(2, '0');
        }

        function formatDate(date) {
            return (
                [
                    date.getFullYear(),
                    padTo2Digits(date.getMonth() + 1),
                    padTo2Digits(date.getDate()),
                ].join('. ') +
                '. ' +
                [
                    padTo2Digits(date.getHours()),
                    padTo2Digits(date.getMinutes()),
                    padTo2Digits(date.getSeconds()),
                ].join(':')
            );
        }

        function getArrayIndex(id) {
            return members.findIndex(x => x.dbid === id)
        }

        function deleteOldImage(dbid, imgname) {
            let deffered = $q.defer()

            $http.post(AppInfos.baseUrl + "backend/attendance/deletesign.php", {
                id: dbid,
                imgname: imgname
            }).then((res) => {
                if (res.data === "success") {
                    deffered.resolve(true)
                }
                else if (res.data === "error") {
                    console.error("nem sikerult torolni a regi kepet mert lehet nem letezik.")
                    deffered.resolve(false)
                } else if (res.data == "tokenError") {
                    notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "Hibás a felhasználói tokened vagy lejárt, kérlek lépj be újra!", "");
                    deffered.resolve(false)
                } else {
                    console.error("The error is below")
                    console.error(res)
                    notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "HIBA!! Próbáld újra később!", "");
                    deffered.resolve(false)
                }
            })

            return deffered.promise
        }

        function createSingImage(dbid, sign) {
            let deffered = $q.defer()

            $http.post(AppInfos.baseUrl + "backend/attendance/createSignImg.php", {
                id: dbid,
                sign: sign,
            }).then((res) => {
                if (res.data === "error") {
                    deffered.resolve(false)
                } else if (res.data === "tokenError") {
                    notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "Hibás a felhasználói tokened vagy lejárt, kérlek lépj be újra!", "");
                    deffered.resolve(false)
                } else deffered.resolve({ state: true, name: res.data })
            })

            return deffered.promise
        }

        return {
            closeAttendance: function () {
                $http.post(AppInfos.baseUrl + "backend/attendance/close.php", {
                    id: attendance.dbid
                }).then((res) => {
                    if (res.data == 1) {
                        notify2("top", "right", "", "primary", "animated fadeInRight", "animated fadeOutRight", "Sikeresen lezártad a jelenlétit!", "");
                        $state.go('dash.home')
                    } else if (res.data == "tokenError") {
                        notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "Hibás a felhasználói tokened vagy lejárt, kérlek lépj be újra!", "");
                        return true
                    } else {
                        console.error("The error is below")
                        console.error(res)
                        notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "HIBA!! Próbáld újra később!", "");
                        return true
                    }
                })
            },

            loadAllOpenAttendance: function () {
                let deffered = $q.defer()

                $http.get(AppInfos.baseUrl + "backend/attendance/listOpened.php")
                    .then((res) => {
                        if (typeof res.data == "object") {
                            deffered.resolve(res.data)
                        } else if (res.data == "nincs") {
                            deffered.resolve(false)
                        } else if (res.data == "tokenError") {
                            notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "Hibás a felhasználói tokened vagy lejárt, kérlek lépj be újra!", "");
                            return
                        } else {
                            console.error("The error is below")
                            console.error(res)
                            notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "HIBA!! Próbáld újra később!", "");
                            return
                        }
                    })

                return deffered.promise
            },

            createAttendance: function (data) {
                $http.post(AppInfos.baseUrl + "backend/attendance/create.php", {
                    name: data.name,
                    creatorName: data.creatorName,
                    createDate: formatDate(new Date())
                }).then((res) => {
                    if (!isNaN(res.data)) {
                        this.loadAttendaceById(res.data)

                    } else if (res.data == "tokenError") {
                        notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "Hibás a felhasználói tokened vagy lejárt, kérlek lépj be újra!", "");
                        return true
                    } else {
                        console.error("The error is below")
                        console.error(res)
                        notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "HIBA!! Próbáld újra később!", "");
                        return true
                    }
                })
            },

            loadAttendaceById: function (id) {
                attendance = {}
                members = []

                $http.post(AppInfos.baseUrl + "backend/attendance/loadbyid.php", {
                    id: id
                }).then((res) => {
                    if (typeof res.data == "object") {
                        let data = res.data
                        data.data = data.data.length > 0 ? JSON.parse(data.data) : "" // vissza forditjuk stringrol jsonre

                        attendance = {
                            dbid: data.dbid,
                            areaName: data.areaName,
                            createDate: data.createDate,
                            closeDate: data.closeDate,
                            createName: data.createName,
                            closeName: data.closeName,
                            comment: data.comment,
                        }

                        for (let i = 0; i < data.data.length; i++) {
                            members.push({
                                dbid: data.data[i].dbid,
                                name: data.data[i].name,
                                signStartName: data.data[i].signStartName || "",
                                signEndName: data.data[i].signEndName || "",
                                signStartDate: data.data[i].signStartDate || "",
                                signEndDate: data.data[i].signEndDate || "",
                            })
                        }

                        $state.go("dash.attendanceManage", {
                            id: data.dbid
                        });

                    } else if (res.data == "nincs") {
                        notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "Hiba történt a jelenlévi betöltésekor!", "");
                        console.error(res)
                        return
                    } else if (res.data == "tokenError") {
                        notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "Hibás a felhasználói tokened vagy lejárt, kérlek lépj be újra!", "");
                        return
                    } else {
                        console.error("The error is below")
                        console.error(res)
                        notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "HIBA!! Próbáld újra később!", "");
                        return
                    }
                })
            },

            addMember: function (dbid, name) {
                members.push({
                    dbid: dbid,
                    name: name,
                    signStartName: "",
                    signEndName: "",
                    signStartDate: "",
                    signEndDate: "",
                })
            },

            deleteMember: function (dbid) {
                // ide kene ha volt alairasa akkor azt a kepet is torolje
                members.splice(members.findIndex(x => x.dbid === dbid), 1)
            },

            getAttendace: function () {
                return attendance
            },

            getMembers: function () {
                return members
            },

            updateAttendance: function () {
                let data = members
                let comment = attendance.comment
                data = JSON.stringify(data)

                let deffered = $q.defer()

                $http.post(AppInfos.baseUrl + "backend/attendance/update.php", {
                    comment: comment,
                    id: attendance.dbid,
                    data: data,
                }).then((res) => {
                    if (res.data == 1) {
                        deffered.resolve(true)
                    } else if (res.data == "tokenError") {
                        notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "Hibás a felhasználói tokened vagy lejárt, kérlek lépj be újra!", "");
                    } else {
                        console.error("The error is below")
                        console.error(res)
                        notify2("top", "right", "", "danger", "animated fadeInRight", "animated fadeOutRight", "HIBA!! Próbáld újra később!", "");
                    }
                })

                return deffered.promise
            },

            insertStartSign: function (dbid, sign) {
                let index = getArrayIndex(dbid)

                // törölni kell a régi képet ha már van
                if (members[index].signStartName) {
                    if (deleteOldImage(members[index].dbid, members[index].signStartName)) {
                        console.log("sikeres a torles")
                        createSingImage(dbid, sign).then((res) => {
                            if (res.state) {
                                console.log(res.name)
                                members[index].signStartName = res.name
                                members[index].signStartDate = formatDate(new Date())

                                this.updateAttendance()
                            }
                        })
                    }
                } else {
                    createSingImage(dbid, sign).then((res) => {
                        if (res.state) {
                            console.log(res.name)
                            members[index].signStartName = res.name
                            members[index].signStartDate = formatDate(new Date())

                            this.updateAttendance()
                        }
                    })
                }
            },

            insertEndSign: function (dbid, sign) {
                let index = getArrayIndex(dbid)

                // törölni kell a régi képet ha már van
                if (members[index].signEndName) {
                    if (deleteOldImage(members[index].dbid, members[index].signEndName)) {
                        console.log("sikeres a torles", members[index].signEndName)
                        createSingImage(dbid, sign).then((res) => {
                            if (res.state) {
                                console.log(res.name)
                                members[index].signEndName = res.name
                                members[index].signEndDate = formatDate(new Date())

                                this.updateAttendance()
                            }
                        })
                    }
                } else {
                    createSingImage(dbid, sign).then((res) => {
                        if (res.state) {
                            console.log(res.name)
                            members[index].signEndName = res.name
                            members[index].signEndDate = formatDate(new Date())

                            this.updateAttendance()
                        }
                    })
                }
            },

            addComment: function (comment) {
                attendance.comment = comment
                this.updateAttendance()
            },

            checkSignPerm: function (perm) {
                let count = 0

                angular.forEach(members, (val, key) => {
                    if (val.signStartName == "")
                        count++
                    if (val.signEndName == "")
                        count++
                })

                if (count > 0 && perm != 'admin') {
                    notify2("top", "right", "", "warning", "animated fadeInRight", "animated fadeOutRight", "Nincs jogod lezárni mivel még valaki nem írta alá!", "");
                    return [false, "noPerm"]
                }
                else if (count > 0 && perm == 'admin') {
                    return [false, "havePerm"]
                }
                else
                    return [true]
            }
        }
    }
    angular.module('bbdApp').service('attendanceService', attendanceServiceCtrl)
})();