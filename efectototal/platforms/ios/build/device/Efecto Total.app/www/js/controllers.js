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

	$scope.share = function(){
		
	}
})

.controller('LoginCtrl', function($scope, $location, OpenFB) {
	function registerAndLogin(){
		OpenFB.api({
	        path: '/me',
	        success: createUser,
	        error: showError
    	});
		$location.path('/app/perfil');
	}
	function createUser(data){
		console.log(data);
	}
	function showError() {
		alert('OpenFB login failed');
	}
	$scope.facebookLogin = function () {
		OpenFB.login('email,publish_stream').then(registerAndLogin, showError);
	};
})