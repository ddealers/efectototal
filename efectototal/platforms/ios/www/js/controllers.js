angular.module('efectototal.controllers', [])

.controller('AppCtrl', function($scope, $state) {
	$scope.logout = function () {
		facebookConnectPlugin.logout();
		$state.go('app.login');
	};

	$scope.share = function(){
		facebookConnectPlugin.showDialog({method:'apprequests',message:'Te invito a usar Efecto Total'}, onSuccess, errorCallback);
		//facebookConnectPlugin.api('me?fields=invitable_friends', renderFriends, errorCallback);
		function errorCallback(error){
			console.log(error);
		}
		function onSuccess(data){
			console.log(data);
		}
	}
})
.controller('LoginCtrl', function($scope, $location, User) {
	$scope.loading = false;
	function registerAndLogin(){
		facebookConnectPlugin.api('/me', null, onSuccess, onError);
	}
	function onSuccess(data){
		User.create(data).then(function(data){
			var birthday = new Date(data.scope.birthday).toISOString().substring(0, 10);
			localStorage.setItem('name', data.scope.name);
			localStorage.setItem('email', data.scope.email);
			localStorage.setItem('birthday', birthday);
			localStorage.setItem('fbid', data.fbid);
			localStorage.setItem('id', data.id);
			$scope.loading = false;
			$location.path('/app/perfil');
		}, function(error){
			$scope.loading = false;
			navigator.notification.alert(error, errorCallback);
		});
	}
	function onError(error) {
		navigator.notification.alert(error, errorCallback);
	}
	function errorCallback(error){
		console.log(error);
	}
	$scope.facebookLogin = function () {
		$scope.loading = true;
		facebookConnectPlugin.login(
			['email','user_birthday','user_friends'],registerAndLogin,onError);
	};
})

.controller('ProfileInfoCtrl', function($scope){
	$scope.data = {
		name: localStorage.getItem('name'),
		email: localStorage.getItem('email'),
		birthday: localStorage.getItem('birthday'),
		height: localStorage.getItem('height'),
		weight: localStorage.getItem('weight')
	};

	$scope.$watch('data.height',function(newValue, oldValue){
		$scope.getIMC();
		$scope.getIdealWeight();
		localStorage.setItem('height', newValue);
	});
	$scope.$watch('data.weight',function(newValue, oldValue){
		$scope.getIMC();
		$scope.getIdealWeight();
		localStorage.setItem('weight', newValue);
	});
	$scope.getIMC = function(){
		$scope.IMC = ($scope.data.weight / Math.pow($scope.data.height / 100,2)).toFixed(2);
	}
	$scope.getIdealWeight = function(){
		/*
		var baseWeight = $scope.data.height-100;
		idealWeight = baseWeight*0.9;
		$scope.idealIMC = (idealWeight/Math.pow($scope.data.height / 100, 2)).toFixed(2);
		*/
		$scope.idealIMC = (21 * Math.pow($scope.data.height / 100,2)).toFixed(2);
	}

	$scope.getIMC();
	$scope.getIdealWeight();
})
.controller('BlogCtrl', function($scope, $state, Blog) {
	Blog.posts().then(function(data){
		console.log(data);
	});
})
.controller('CounterCtrl', function($scope, $state, $interval) {
	var counter,
		mins = 0, secs = 0,
		weight,total,
		rawData, steps, maxvalues, threshold, loss;

	rawData = [];
	steps = 0;
	loss = {mins: 0, secs: 0};
	weight = localStorage.getItem('weight');
	total = localStorage.getItem('totalCal') || 0;
	max = localStorage.getItem('maxCal') || 0;

	$scope.secs = '00';
	$scope.mins = '00';
	$scope.calories = 0;
	$scope.max = max;
	$scope.total = total;
	$scope.action = "Iniciar";


	if(!weight){
		navigator.notification.alert('Necesitas introducir tu peso antes de comenza a utilizar el contador', onError);
	}
	function onError(){
		console.log('Error', 'No peso');
		$state.go('app.perfil_informacion');
	}
	$scope.toggleCounter = function(){
		var prevY = 0;
		if (angular.isDefined(counter)) {
        	$interval.cancel(counter);
        	counter = undefined;
        	//watch = undefined;
        	localStorage.setItem('totalCal', $scope.total);
        	if($scope.calories > max){
        		localStorage.setItem('maxCal', $scope.calories);
        	}
        	$scope.action = "Iniciar";
      	}else{
			counter = $interval(function(){
				secs++;
				setMinSecs();
				setCaloricCount();
			},1000);
			//watch = navigator.accelerometer.watchAcceleration(setCaloricCount, onError, {frequency: 500});
			$scope.action = "Detener";
		}
	}
	function setCaloricCount(){
		/*
		var sum;
		if(steps < 60){
			steps++;
			rawData.push(acceleration);
		}else{
			maxValues = rawData.sort(function(a,b){
				return a.y < b.y;
			});
			for(var i = 0; i < 15; i++){
				sum += maxValues[i].y;
			}
			threshold = sum/15;
		}
		if(threshold && acceleration.y < threshold){
			loss.secs++;
			if(loss.secs == 60){
				loss.secs = 0;
				loss.mins++;
			}
		}
		*/
		$scope.calories = (0.023 * weight * 2.2 * mins + 0.023 * weight * 2.2 * secs/60).toFixed(2);
		$scope.total = (parseFloat(total) + parseFloat($scope.calories)).toFixed(2);
		if($scope.max <= $scope.calories){
			$scope.max = $scope.calories;
		}
	}
	function setMinSecs(){
		if(secs >= 60){
			mins++;
			secs = 0;
		}
		$scope.secs = zero(mins);
		$scope.mins = zero(secs);
	}
	function zero(num){
		if(num.toString().length < 2){
			return '0'+num;
		}else{
			return num.toString();
		}
	}
	/*
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
		}, 100, 80).then(function(){
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
	*/
})

function trace(obj){
	for(var a in obj){
		if(obj.hasOwnProperty(a)) console.log(a, obj[a]);
	}
}