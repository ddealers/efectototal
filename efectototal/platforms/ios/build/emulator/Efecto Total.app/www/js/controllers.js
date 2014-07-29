angular.module('efectototal.controllers', [])

.controller('AppCtrl', function($scope, $state, Videos) {
	$scope.categorias = false;

	$scope.toggleSubmenu = function(vars){
		$scope[vars] = !$scope[vars];
	}
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
	});
})
.controller('LoginCtrl', function($scope, $state, OpenFB, User) {
	$scope.loading = false;
	function registerAndLogin(data){
		sessionStorage.setItem('fbtoken', data.authResponse.accessToken);
		OpenFB.get('/me').success(onSuccess);
	}
	function onSuccess(data){
		User.create(data).then(function(data){
			var birthday;
			if(data.scope.birthday){
				birthday = new Date(data.scope.birthday).toISOString().substring(0, 10);
			}else{
				birthday = null;
			}
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
		height: localStorage.getItem('height') || 0,
		weight: localStorage.getItem('weight') || 0
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
.controller('CategoriesCtrl', function($scope, $state, $stateParams, CaloricCounter, Videos, User){
	var id = localStorage.getItem('id');
	var video = angular.element(document.querySelector('#front-video'));
	
	$scope.videos = [];
	$scope.onroutine = false;
	
	$scope.toggleVideo = function(video){
		User.toggle(id, video).then(function(data){
			$scope.onroutine = data;
		});
	}
	$scope.$watch('videos', function(){
		if($scope.videos.length > 0){
			Videos.status(id, $scope.videos[0].id_video).then(function(data){
				$scope.onroutine = (data.estatus == "0") ? false : true;
			});
		}
	});
	function onPause(){
		CaloricCounter.stop();
		video[0].removeEventListener('pause', onPause);
		video[0].addEventListener('play', onPlay, false);
	}
	function onPlay(){
		video[0].pause();
		video[0].removeEventListener('play', onPlay);
		navigator.notification.alert('Comenzar a contar calorías. Todas tus calorías se contarán para tus retos.', onConfirm);
	}
	function onConfirm(){
		CaloricCounter.init($scope);
		video[0].play();
		video[0].addEventListener('pause', onPause, false);
	}
	function onEnd(){
		CaloricCounter.stop();
	}
	Videos.byCategory($stateParams.cat).then(
		function(data){
			$scope.videos = data;
			video.attr("src", "http://efectototal.com/media/" + data[0].src);
			video.attr("poster", "http://efectototal.com/media/" + data[0].thumb2);
			video[0].addEventListener('play', onPlay, false);
			video[0].addEventListener('ended', onEnd, false);
		},
		function(){
			navigator.notification.alert("No hay videos disponibles para esta categoría",function(){
			$state.go('app.perfil');
		});
	});
})
.controller('VideoCtrl', function($scope, $state, $stateParams, $interval, CaloricCounter, Videos, User){
	var id = localStorage.getItem('id');
	var video = angular.element(document.querySelector('#exercise-video'));
	
	$scope.onroutine = false;

	$scope.toggleVideo = function(video){
		User.toggle(id, video).then(function(data){
			$scope.onroutine = data;
		});
	}
	$scope.$watch('video', function(){
		if($scope.video){
			Videos.status(id, $scope.video.id_video).then(function(data){
				$scope.onroutine = (data.estatus == "0") ? false : true;
			});
		}
	});
	function onPause(){
		CaloricCounter.stop();
		video[0].removeEventListener('pause', onPause);
		video[0].addEventListener('play', onPlay, false);
	}
	function onPlay(){
		video[0].pause();
		video[0].removeEventListener('play', onPlay);
		navigator.notification.alert('Comenzar a contar calorías. Todas tus calorías se contarán para tus retos.', onConfirm);
	}
	function onConfirm(){
		CaloricCounter.init($scope);
		video[0].play();
		video[0].addEventListener('pause', onPause, false);
	}
	function onEnd(){
		CaloricCounter.stop();
	}
	Videos.byId($stateParams.video).then(function(data){
		$scope.video = data;
		video.attr("src", "http://efectototal.com/media/" + data.src);
		video.attr("poster", "http://efectototal.com/media/" + data.thumb2);
		video[0].addEventListener('play', onPlay, false);
		video[0].addEventListener('ended', onEnd, false);
	});
})
.controller('MisRutinasCtrl', function($scope, $state, User){
	var id = localStorage.getItem('id');
	$scope.fbid = localStorage.getItem('fbid');
	$scope.goto = function(video){
		$state.go('app.videos',{video:video});
	}
	User.routines(id).then(function(data){
		$scope.routines = data;
	});
})
.controller('MiActividadCtrl', function($scope, $state){
	$scope.fbid = localStorage.getItem('fbid');
})
.controller('MisRetosCtrl', function($scope, $state, Challenge){
	var id = localStorage.getItem('id');
	$scope.fbid = localStorage.getItem('fbid');
	Challenge.user(id).then(function(data){
		$scope.challenges = data;
	});
})
.controller('NewsfeedCtrl', function($scope, $state){
	$scope.fbid = localStorage.getItem('fbid');
})
.controller('ConfigCtrl', function($scope, $state){
	$scope.openPrivacy = function(){
		window.open('media/privacy.pdf', '_blank', 'location=no');
	}
	$scope.openTerms = function(){
		window.open('media/terms.pdf', '_blank', 'location=no');
	}
	$scope.logout = function () {
		facebookConnectPlugin.logout();
		localStorage.clear();
		sessionStorage.clear();
		$state.go('login');
	};
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
.controller('ChallengeInitCtrl', function($scope, $state, $ionicModal, Challenge){
	$scope.fbid = localStorage.getItem('fbid');
	$scope.challenge = {
		id: localStorage.getItem('id'),
		name: null,
		calories: 0,
		duration: 0,
		start: new Date().toISOString().substring(0, 10),
		friends: []
	}

	$ionicModal.fromTemplateUrl('templates/invite-friends.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	$scope.selectFriends = function(){
		facebookConnectPlugin.api('/me/?fields=friends',[],function(data){
			$scope.friends = data.friends.data;
			$scope.modal.show();
		});
	}
	$scope.selectedFriends = function(){
		$scope.modal.hide();
	}
	$scope.createChallenge = function(){
		var _i = 0, _results = [], _selectedFriends, _friend;
		_selectedFriends = $scope.friends.filter(function(value, index, arr){
			return value.selected;
		});
		for(_i = 0; _i < _selectedFriends.length; _i++){
			_friend = _selectedFriends[_i];
			_results.push(_friend.id);
		}
		$scope.challenge.friends = _results.toString();

		Challenge.create($scope.challenge).then(onSuccess, onError);
	}
	function onSuccess(){
		navigator.notification.alert('Tú reto ha sido creado', errorCallback);
		$state.go('app.retos');
	}
	function onError(error) {
		navigator.notification.alert(error, errorCallback);
	}
	function errorCallback(data){
		console.log(data);
	}
})
.controller('ChallengeInviteCtrl', function($scope, $state, $stateParams, Challenge){
	var id = localStorage.getItem('id');
	$scope.fbid = localStorage.getItem('fbid');
	$scope.name = localStorage.getItem('name');
	$scope.accept = function(){
		Challenge.update(id, $stateParams.reto, 1).then(function(data){
			$state.go('app.retos-calendario',{reto: $stateParams.reto});
		});
	}
	$scope.decline = function(){
		Challenge.update(id, $stateParams.reto, 0).then(function(data){
			$state.go('app.retos');
		});
	}
	Challenge.byId(id, $stateParams.reto).then(function(data){
		$scope.challenge = data;
	});
})
.controller('ChallengeCalCtrl', function($scope, $state, $stateParams, Challenge){
	var _i, _j,
		_totalCurrent,
		_totalContender,
		_length,
		_contender,
		id = localStorage.getItem('id');

	function getTotalCurrent(data){
		_totalCurrent = 0;
		if(data.current.calories && data.current.calories.length > 0){
			_length = data.current.calories.length;
			for(_i = 0; _i < _length; _i++){
				_totalCurrent += parseFloat(data.current.calories[_i].calories);
			}
		}
		data.current.total = _totalCurrent;
	}
	function getTotalContenders(data){
		if(data.contenders && data.contenders.length > 0){
			_length = data.contenders.length;
			for(_i = 0; _i < _length; _i++){
				_totalContender = 0;
				_contender = data.contenders[_i];
				if(_contender.calories && _contender.calories.length > 0){
					_contender.length = _contender.calories.length;
					for(_j = 0; _j < _contender.length; _j++){
						_totalContender += parseFloat(_contender.calories[_j].calories);
					}
				}
				_contender.total = _totalContender;
			}
		}
	}
	function getWinnersByDate(data){
		var _d;
		var calories, umax, cmax;
		var day, start = new Date(data.challenge.start_at);
		var calendar = [];
		for(_d = 0; _d < 31; _d++){
			if(_d < data.challenge.days){
				day = new Date(start.getTime() + _d * 24 * 60 * 60 * 1000);
				dayStr = day.getFullYear()+"-"+zero(day.getMonth()+1)+"-"+zero(day.getDate());
				for (var c in data.contenders){
					calories = data.contenders[c].calories;
					cmax = 0;
					for (var cal in calories){
						if(calories[cal].date == dayStr){
							cmax = calories[cal].calories;
						}
					}
				}
				calories = data.current.calories;
				umax = 0;
				for(var cal in calories){
					if(calories[cal].date == dayStr){
						umax = calories[cal].calories;
					}
				}
				if(parseFloat(cmax) > parseFloat(umax)){
					calendar.push('contender');	
				}else if(parseFloat(cmax) == parseFloat(umax)){
					calendar.push('draw');	
				}else{
					calendar.push('current');
				}
			}else{
				calendar.push('background');
			}
		}
		data.calendar = calendar;
	}
	function zero(num){
		if(num.toString().length < 2){
			return '0'+num;
		}else{
			return num.toString();
		}
	}
	Challenge.byId(id, $stateParams.reto).then(function(data){
		getTotalCurrent(data);
		getTotalContenders(data);
		getWinnersByDate(data);
		$scope.challenge = data;
	});

})
.controller('ChallengeResultsCtrl', function($scope, $state, $stateParams, Challenge){
	var id = localStorage.getItem('id');
	
	$scope.fbid = localStorage.getItem('fbid');
	$scope.name = localStorage.getItem('name');
	
	Challenge.byId(id, $stateParams.reto).then(function(data){
		$scope.challenge = data;
		$scope.winner = data.current;
		for(var contender in data.contenders){
			if(data.contenders[contender].total > $scope.winner.total) 
				$scope.winner = data.contenders[contender];
		}
	});
})
.controller('CounterCtrl', function($rootScope, $scope, $state, $interval, User, CaloricCounter) {
	var id = localStorage.getItem('id'),
		max = localStorage.getItem('maxCal') || 0;

	if(max < 50){
		max = 50;
		localStorage.setItem('maxCal', 50);
	}

	$scope.fbid = localStorage.getItem('fbid');
	$scope.name = localStorage.getItem('name');
	$scope.secs = '00';
	$scope.mins = '00';
	$scope.calories = 0;
	$scope.max = max;
	$scope.action = "Iniciar";

	User.calories(id).then(function(data){
		$scope.historial = data.calories;
		$scope.total = total = data.total;
	});
	$scope.$on('CaloricCounter.COUNT', function(e, calories, secs, mins){
		$scope.secs = secs;
		$scope.mins = mins;
		$scope.calories = calories;
		$scope.total = parseFloat(total) + parseFloat($scope.calories);
		if($scope.max <= $scope.calories){
			$scope.max = $scope.calories;
		}
	});
	$scope.toggleCounter = function(){
		if(CaloricCounter.active){
			CaloricCounter.active = false;
			CaloricCounter.stop();
			if($scope.calories > max){
				localStorage.setItem('maxCal', $scope.calories);
			}
			$scope.action = "Iniciar";
		}else{
			CaloricCounter.active = true;
			CaloricCounter.init($scope);
			$scope.action = "Detener";
		}
	}
})

function trace(obj){
	for(var a in obj){
		if(obj.hasOwnProperty(a)) console.log(a, obj[a]);
	}
}