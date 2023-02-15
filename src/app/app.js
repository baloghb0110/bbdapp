/*
    az avatarnal az src-t at kell irni (employeeview, employeecreate)

    !!!!!
    oldal ujratoltesnel az authFactoryban a getuserdata nem ad vissza erteket
    !!!!!


    amikor a jelenletibol toroljuk az embert akkor onnan az alairas kepe is torlodjon a mappabol
*/

var app = angular.module('bbdApp', [
    'ui.router',
    'ui.router.state.events',
    'ngFileUpload',
    'ui.calendar',
    'signature',
    'ngDialog'
]);

app.constant("AppInfos", {
    "baseUrl": "http://127.0.0.1/src/"
    //"baseUrl": "app/"
});

app.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $qProvider, $locationProvider) {
    $qProvider.errorOnUnhandledRejections(false);
    $urlRouterProvider.otherwise('/login');
    $locationProvider.hashPrefix('bbdcomtech');

    $httpProvider.interceptors.push('TokenFactory');

    $stateProvider
        .state('login', {
            url: '/login',
            title: 'none',
            controller: 'loginCtrl',
            templateUrl: 'views/public/login.html',
            data: {
                isPublic: true
            }
        })
        .state('dash', {
            url: '/dash',
            title: 'none',
            controller: 'dashCtrl',
            templateUrl: 'views/private/dash.html',
            abstract: true,
            date: {
                isPrivate: true
            }
        })
        .state('dash.home', {
            url: '/home',
            title: 'Jelenlétik',
            controller: 'attendanceCtrl',
            templateUrl: 'views/private/attendance/attendance.html',
            data: {
                isPrivate: true
            },
            sidebarMeta: {
                icon: 'bi-stickies',
                order: 800,
            },
            params: {
                authRoles: ['developer', 'admin', 'user'],
            },
        })
        .state('dash.createAttendance', {
            url: '/createAttendance',
            title: 'Jelenléti létrehozás',
            controller: 'attendanceCreateCtrl',
            templateUrl: 'views/private/attendance/attendanceCreate.html',
            data: {
                isPrivate: true
            },
            sidebarMeta: {
                icon: 'bi-card-checklist',
                order: 800,
            },
            params: {
                authRoles: ['developer', 'admin', 'user'],
            },
        })
        .state('dash.attendanceManage', {
            url: '/attendanceManage/{id}',
            controller: 'attendanceManageCtrl',
            templateUrl: 'views/private/attendance/manage.html',
            data: {
                isPrivate: true
            },
        })
        .state('dash.free', {
            url: '/free',
            title: 'Szabadság igénylés',
            controller: "freeCtrl",
            templateUrl: 'views/private/free/free.html',
            data: {
                isPrivate: true
            },
            sidebarMeta: {
                icon: 'bi-calendar-plus',
                order: 800,
            },
            params: {
                authRoles: ['developer', 'admin', 'user'],
            },
        })
        // Admin
        .state('dash.adminData', {
            url: "/adminData",
            title: "Törzsadatok",
            label: "Admin",
            //controller: "DashHomeCtrl",
            template: '<ui-view autoscroll="true" autoscroll-body-top></ui-view>', // kell ha submenüs a kategória
            data: {
                isPrivate: true
            },
            sidebarMeta: {
                icon: 'bi-person-bounding-box',
                order: 800,
            },
            params: {
                authRoles: ['developer', 'admin']
            },
        })
        .state('dash.adminData.personaldata', {
            url: "/personaldata",
            title: "Alkalmazotti lista",
            icon: "bi-calendar-plus",
            controller: "employee",
            templateUrl: "views/private/adminPages/employee/employee.html",
            sidebarMeta: {
                order: 400,
            },
            data: {
                isPrivate: true
            },
            params: {
                authRoles: []
            },
        })
        .state('dash.adminData.personaldataadd', {
            url: "/employe_add",
            controller: "employeeAddCtrl",
            templateUrl: "views/private/adminPages/employee/employeecreate.html",
            data: {
                isPrivate: true
            }
        })
        .state('dash.adminData.personalView', {
            url: '/personalview',
            controller: "personalview",
            templateUrl: "views/private/adminPages/employee/employeeview.html",
            data: {
                isPrivate: true
            },
            params: {
                name: null,
                table: null
            }
        })
        .state('dash.adminData.personalEdit', {
            url: "/personaledit",
            controller: "personaledit",
            templateUrl: "views/private/adminPages/employee/employeeedit.html",
            data: {
                isPrivate: true
            },
            params: {
                id: null,
                name: null,
                table: null,
                status: null,
            }
        })
        .state('dash.adminData.workAreas', {
            url: "/workareas",
            title: "Munkaterületek",
            controller: "workAreaCtrl",
            templateUrl: "views/private/adminPages/workarea/workarea.html",
            sidebarMeta: {
                order: 400,
            },
            data: {
                isPrivate: true
            },
            params: {
                authRoles: []
            },
        })
});

app.run(function ($rootScope, $window, $state, $q, auth) {
    $rootScope.$on('$stateChangeStart', function (event, state, toParams, fromState, fromParams) {
        //var myElem = angular.element(".has-navbar-vertical-aside");
        //var asd = myElem.attr('class')
        //myElem.attr("class", "has-navbar-vertical-aside navbar-vertical-aside-show-xl footer-offset navbar-vertical-aside-closed-mode navbar-vertical-aside-mini-mode")

        //event.preventDefault()
        /*if (state.params && state.params.authRoles) {
            var d = result[1]

            if (d.status)
                if (d.permission) {
                    var role_index = state.params.authRoles.findIndex(x => x === d.permission);
                    console.log(role_index)
                    if (role_index == -1) {
                        //event.preventDefault()
                        console.log("asd")
                        $state.go('dash.home')
                        return;
                    }
                }
                else
                    event.preventDefault()
            else
                event.preventDefault()
        }*/

        var token = $window.localStorage.getItem('token')
        if (token !== null) {
            var authProm = auth.isValid(token)
            $q.all([authProm]).then(function (result) {

                if (result[0] == 1) {
                    if (state.data && state.data.isPublic) {
                        event.preventDefault()
                        $state.go('dash.home')
                    }
                } else {
                    if (state.data && state.data.isPrivate) {
                        $window.localStorage.removeItem("token")
                        event.preventDefault()
                        $state.go('login')
                    }
                }
            })
        } else {
            if (state.data && state.data.isPrivate) {
                event.preventDefault()
                $state.go('login')
            }
        }
    })
});

var __version_number = 1126.7; // cacheBustSuffix = Date.now('U'); // 'U' -> linux/unix epoch date int

app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push(function () {
        return {
            'request': function (config) {
                // !!config.cached represents if the request is resolved using 
                //      the angular-templatecache
                if (!config.cached) {
                    config.url += ((config.url.indexOf('?') > -1) ? '&' : '?')
                        + config.paramSerializer({ v: __version_number });
                } else if (config.url.indexOf('no-cache') > -1) {
                    // if the cached URL contains 'no-cache' then remove it from the cache
                    config.cache.remove(config.url);
                    config.cached = false; // unknown consequences
                    // Warning: if you remove the value form the cache, and the asset is not
                    //          accessable at the given URL, you will get a 404 error.
                }
                return config;
            }
        }
    });
}]);