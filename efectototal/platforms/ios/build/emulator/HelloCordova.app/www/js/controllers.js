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
		OpenFB.login('email,read_stream,publish_stream').then(
			function () {
				console.log('logged in');
				$location.path('/app/person/me/feed');
			},
			function () {
				alert('OpenFB login failed');
			}
		);
	};
})

.controller('InitCtrl', function($scope, openFB){
  $scope.login = function(){
    openFB.login
  }
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
