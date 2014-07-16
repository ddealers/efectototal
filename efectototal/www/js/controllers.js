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

.controller('CounterCtrl', function($scope, $interval) {
	var rawData = [];
	var threshold = 0,
		watch = null;

	function logValue(acceleration){
		rawData.push(acceleration);
	}
	function onStart(acceleration){
		var maxValues, total = 0;
		$interval(function(){
			navigator.accelerometer.getCurrentAcceleration(logValue, onError);
		}, 100, 70).then(function(){
			maxValues = rawData.sort(function(a,b){
				return a.y < b.y;
			});
			for(var i = 0; i < 15; i++){
				total += maxValues[i].y;
			}
			threshold = total/15;
			initWatch();
		});
	}
	function onSuccess(acceleration){
		if(acceleration.y > threshold) console.log("step");
	}
	function onError(error){
		console.log(error);
	}
	function initWatch(){
		watch = navigator.accelerometer.watchAcceleration(onSuccess, onError, {frequency: 500});
	}
	onStart();
})