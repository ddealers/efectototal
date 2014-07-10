angular.module('efectototal.controllers', [])

.controller('AppCtrl', function($scope) {
	$scope.logout = function () {
		OpenFB.logout();
		$state.go('app.login');
	};

	$scope.revokePermissions = function () {
		OpenFB.revokePermissions().then(
			function () {
				$state.go('app.login');
			},
			function () {
				alert('Revoke permissions failed');
			}
		);
	};
})

.controller('LoginCtrl', function($scope, $location, OpenFB) {
	$scope.facebookLogin = function () {
		OpenFB.login('email,publish_stream').then(
			function () {
				$location.path('/app/perfil');
			},
			function () {
				alert('OpenFB login failed');
			}
		);
	};
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})
