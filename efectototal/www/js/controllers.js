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