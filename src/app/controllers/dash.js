(function () {
    function dashCtrl($scope, $http, $window, $state, $location, auth) {
        $scope.logOut = function () {
            $window.localStorage.removeItem("token")
            $window.localStorage.removeItem("userData")
            $state.go('login')
        }

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        }

        auth.hasRoleByToken($window.localStorage.getItem('token')).then(function (res) {
            if (res.status) {
                var states = $state.get()
                    .filter(function (s) {
                        return s.sidebarMeta;
                    })
                    .map(function (s) {
                        var meta = s.sidebarMeta;
                        return {
                            name: s.name,
                            url: s.url,
                            title: s.title,
                            label: s.label,
                            level: ((s.name.match(/\./g) || []).length - 1),
                            order: meta.order,
                            icon: meta.icon,
                            stateRef: s.name,
                            authRoles: s.params ? s.params.authRoles : undefined,
                        }


                    })
                    .sort(function (a, b) {
                        return (a.level - b.level) * 100 + a.order - b.order;
                    });


                var menuItems = states.filter(function (item) {
                    if (item.authRoles != undefined) {
                        var role_index = item.authRoles.findIndex(x => x === res.permission);
                        if (role_index >= 0)
                            if (item.authRoles[role_index] == res.permission)
                                return item;
                    }
                });

                menuItems.forEach(function (item) {
                    var children = states.filter(function (child) {
                        return child.level == 1 && child.name.indexOf(item.name) === 0;
                    });
                    item.subMenu = children.length ? children : null;
                });

                $scope.menuItems = menuItems;
            }
        })
    }

    angular.module('bbdApp').controller('dashCtrl', dashCtrl)
})();

