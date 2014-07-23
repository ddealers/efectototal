angular.module('efectototal.controllers', [])

.controller('AppCtrl', function($scope, $state, Videos) {
	$scope.categorias = false;

	$scope.toggleSubmenu = function(vars){
		$scope[vars] = !$scope[vars];
	}
	$scope.logout = function () {
		facebookConnectPlugin.logout();
		$state.go('app.login');
	};

	$scope.share = function(){
		facebookConnectPlugin.showDialog({method:'apprequests',message:'Te invito a usar Efecto Total'}, onSuccess, errorCallback);
	}
	function errorCallback(error){
		console.log(error);
	}
	function onSuccess(data){
		console.log(data);
	}
	Videos.categories().then(function(categories){
		$scope.categories = categories;
		console.log($scope.categories);
	});
})
.controller('LoginCtrl', function($scope, $state, OpenFB, User) {
	$scope.loading = false;
	function registerAndLogin(data){
		sessionStorage.setItem('fbtoken', data.authResponse.accessToken);
		console.log(data.authResponse.accessToken, sessionStorage.getItem('fbtoken'));
		OpenFB.get('/me').success(onSuccess);
	}
	function onSuccess(data){
		User.create(data).then(function(data){
			var birthday = new Date(data.scope.birthday).toISOString().substring(0, 10);
			localStorage.setItem('name', data.scope.name);
			localStorage.setItem('email', data.scope.email);
			localStorage.setItem('birthday', birthday);
			localStorage.setItem('fbid', data.scope.fbid);
			localStorage.setItem('id', data.id);
			$scope.loading = false;
			$state.go('app.perfil');
		}, function(error){
			$scope.loading = false;
			navigator.notification.alert(error, errorCallback);
		});
	}
	function onError(error) {
		navigator.notification.alert(error, errorCallback);
	}
	function errorCallback(data){
		console.log(data);
	}
	$scope.facebookLogin = function () {
		$scope.loading = true;
		facebookConnectPlugin.login(['email','user_birthday','user_friends'],registerAndLogin,onError);
	};
})

.controller('ProfileCtrl', function($scope){
	$scope.fbid = localStorage.getItem('fbid');
})

.controller('ProfileInfoCtrl', function($scope){
	$scope.data = {
		name: localStorage.getItem('name'),
		email: localStorage.getItem('email'),
		birthday: localStorage.getItem('birthday'),
		height: localStorage.getItem('height'),
		weight: localStorage.getItem('weight')
	};
	$scope.fbid = localStorage.getItem('fbid');
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
.controller('CategoriesCtrl', function($scope, $state, $stateParams, Videos, User){
	var id = localStorage.getItem('id');
	$scope.videos = [];
	$scope.onroutine = false;
	
	$scope.toggleVideo = function(video){
		User.toggle(id, video).then(function(data){
			$scope.onroutine = data;
		});
	}
	
	Videos.byCategory($stateParams.cat).then(function(data){
		$scope.videos = data;
	});
	$scope.$watch('videos', function(){
		if($scope.videos.length > 0){
			Videos.status(id, $scope.videos[0].id_video).then(function(data){
				$scope.onroutine = (data.estatus == "0") ? false : true;
			});
		}
	});
})
.controller('VideoCtrl', function($scope, $state, $stateParams, Videos, User){
	var id = localStorage.getItem('id');
	$scope.onroutine = false;

	$scope.toggleVideo = function(video){
		User.toggle(id, video).then(function(data){
			$scope.onroutine = data;
		});
	}
	Videos.byId($stateParams.video).then(function(data){
		$scope.video = data;
	});
	$scope.$watch('video', function(){
		if($scope.video.id_video){
			Videos.status(id, $scope.video.id_video).then(function(data){
				$scope.onroutine = (data.estatus == "0") ? false : true;
			});
		}
	});
})
.controller('MisRutinasCtrl', function($scope, $state){
	var id = localStorage.getItem('id');
	$scope.fbid = localStorage.getItem('fbid');
	
	User.routines(id).then(function(data){
		$scope.routines = data;
	});
})
.controller('MiActividadCtrl', function($scope, $state){
	$scope.fbid = localStorage.getItem('fbid');
})
.controller('MisRetosCtrl', function($scope, $state){
	$scope.fbid = localStorage.getItem('fbid');
})
.controller('NewsfeedCtrl', function($scope, $state){
	$scope.fbid = localStorage.getItem('fbid');
})
.controller('BlogCtrl', function($scope, $state, $sce, $ionicLoading, Blog) {
	$scope.posts = [];
	$scope.renderTitle = function(title){
		if(title) return title.replace(/&#8220;/,'"').replace(/&#8221;/,'"').replace(/&#8230;/,'...');
	}
	$scope.renderHTML = function(htmlCode){
		return $sce.trustAsHtml(htmlCode);
	};
	$scope.parseDate = function(dateStr){
		var dateArr = dateStr.split(/[- ]/);
		var month = "";
		switch(dateArr[1]){
			case "01":
			month = "ENE";
			break;
			case "02":
			month = "FEB";
			break;
			case "03":
			month = "MAR";
			break;
			case "04":
			month = "ABR";
			break;
			case "05":
			month = "MAY";
			break;
			case "06":
			month = "JUN";
			break;
			case "07":
			month = "JUL";
			break;
			case "08":
			month = "AGO";
			break;
			case "09":
			month = "SEP";
			break;
			case "10":
			month = "OCT";
			break;
			case "11":
			month = "NOV";
			break;
			case "12":
			month = "DIC";
			break;
		}
		return $sce.trustAsHtml(dateArr[2] + '<span>' + month + '</span>');
	};
	$scope.open = function(url){
		window.open(url, '_system', 'location=no');
	}
	$ionicLoading.show({
      template: 'CARGANDO...'
    });
	Blog.posts().then(function(data){
		$ionicLoading.hide();
		$scope.posts = data;
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