angular.module('efectototal.controllers', [])

.controller('AppCtrl', function($scope, $state, Videos) {
	$scope.categorias = false;

	$scope.toggleSubmenu = function(vars){
		$scope[vars] = !$scope[vars];
	}
	$scope.share = function(){
		facebookConnectPlugin.showDialog({method:'apprequests',message:'¡Ejercítate de una forma divertida sintiendo el Efecto Total!'}, onSuccess, errorCallback);
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
.controller('TourCtrl', function($scope, $state){
	$scope.slideHasChanged = function(index){
		if(index == 3){
			$state.go('app.perfil');
		}
	}
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
				//birthday = new Date(data.scope.birthday).toISOString().substring(0, 10);
				birthday = data.scope.birthday;
			}else{
				birthday = null;
			}
			localStorage.setItem('name', data.scope.name);
			localStorage.setItem('email', data.scope.email);
			//localStorage.setItem('birthday', birthday);
			localStorage.setItem('age', data.scope.age);
			localStorage.setItem('weight', data.scope.address);
			localStorage.setItem('height', data.scope.phone);
			localStorage.setItem('fbid', data.scope.fbid);
			localStorage.setItem('id', data.id);
			$scope.loading = false;
			if(localStorage.getItem('tour')){
				$state.go('app.perfil');
			}else{
				localStorage.setItem('tour', true);
				$state.go('app.tour');
			}
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
		facebookConnectPlugin.login(['email','user_friends'],registerAndLogin,onError);
	};
})

.controller('ProfileCtrl', function($scope, $stateParams, Challenge){
	var id = localStorage.getItem('id');
	if(!$stateParams.id){
		$scope.fbid = localStorage.getItem('fbid');
	}
	Challenge.count(id).then(function(data){
		$scope.challengeCount = data;
	});
	Challenge.won(id).then(function(data){
		console.log(data);
		var all = [], count, result;
		if(data > 50) data = 50;
		result = Math.floor(data/5);
		count = data - result * 5;
		if(data == result *  5) count = 5;
		$scope.level = 'icon-ef-level-' + Math.floor(data/5);
		for(var i = 0; i < count; i++){
			all.push(i);
		}
		$scope.challengeItems = all;

	});
})

.controller('ProfileInfoCtrl', function($scope, $filter, User){
	var id = localStorage.getItem('id'),
		height = localStorage.getItem('height'),
		weight = localStorage.getItem('weight');

	height = (height == 'null') ? '' : height;
	weight = (weight == 'null') ? '' : weight;
	//var date = new Date(localStorage.getItem('birthday'));
	//var birthday = $filter('date')(date, 'yyyy-MM-dd');
	//console.log(localStorage.getItem('birthday'), birthday);
	$scope.data = {
		name: localStorage.getItem('name'),
		email: localStorage.getItem('email'),
		//birthday: localStorage.getItem('birthday'),
		age: localStorage.getItem('age'),
		height: height,
		weight: weight
	};
	$scope.fbid = localStorage.getItem('fbid');
	/*
	$scope.$watch('data.birthday', function(newValue, oldValue){
		birthday = new Date(newValue).toISOString().substring(0, 10);
		$scope.getAge();
		User.update(id, {birthday: $scope.data.birthday, age: $scope.age});
		localStorage.setItem('birthday', birthday);
	});
	*/
	$scope.$watch('data.age',function(newValue, oldValue){
		$scope.getFCE();
		User.update(id, {age: $scope.data.age});
		localStorage.setItem('age', newValue);
	});
	$scope.$watch('data.height',function(newValue, oldValue){
		$scope.getIMC();
		$scope.getIdealWeight();
		User.update(id, {phone: $scope.data.height});
		localStorage.setItem('height', newValue);
	});
	$scope.$watch('data.weight',function(newValue, oldValue){
		$scope.getIMC();
		$scope.getIdealWeight();
		User.update(id, {address: $scope.data.weight});
		localStorage.setItem('weight', newValue);
	});
	/*
	$scope.getAge = function(){
		var today = new Date();
		$scope.birth = new Date($scope.data.birthday);
		$scope.age = today.getFullYear() - $scope.birth.getFullYear();
		if(today.getMonth() <= $scope.birth.getMonth() && today.getDate() < $scope.birth.getDate()){
			$scope.age--;
		}
	}
	*/
	$scope.getFCE = function(){
		var fcm = 220 - $scope.data.age,
			fcr = 220 - $scope.data.age - 60;
		$scope.fce = fcr * .60 + 60;

	}
	$scope.getIMC = function(){
		$scope.IMC = $scope.data.weight / Math.pow($scope.data.height / 100,2);
	}
	$scope.getIdealWeight = function(){
		$scope.idealIMC = 21 * Math.pow($scope.data.height / 100,2);
	}

	$scope.getIMC();
	$scope.getIdealWeight();
})
.controller('CategoriesCtrl', function($scope, $state, $stateParams, $ionicModal, History, Playlist, CaloricCounter, Videos, User){
	var id = localStorage.getItem('id');
	var video = angular.element(document.querySelector('#front-video'));
	var selectedVideo = 0,
		counter = false;

	$scope.videos = [];
	$scope.onlist = false;

	$ionicModal.fromTemplateUrl('templates/select-playlist.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	
	$scope.share = function(sm){
		switch(sm){
			case 'fb':
			//window.open('http://www.facebook.com/sharer.php?u='+'http://efectototal.com/videos/cat/'+$stateParams.cat, 'Compartir en Facebook');
			/*
			window.plugins.socialsharing.shareViaFacebook(
				'¡Ejercítate de una forma divertida con esta rutina de Efecto Total!', null /* img , 'http://efectototal.com/videos/cat/'+$stateParams.cat, 
				function() {console.log('share ok')}, 
				function(errormsg){console.log(errormsg)}
			);
			*/
			facebookConnectPlugin.showDialog({
				method: 'feed',
				link: 'http://efectototal.com/videos/cat/'+$stateParams.cat,
				caption: '¡Ejercítate de una forma divertida con esta rutina de Efecto Total!'
			}, function(){console.log('shared')}, function(error){console.log(error)});
			break;
			case 'tw':
			//window.open('https://twitter.com/share?url=¡Ejercítate de una forma divertida con esta rutina de Efecto Total! '+'http://efectototal.com/videos/cat/'+$stateParams.cat, 'Compartir en Twitter');
			window.plugins.socialsharing.shareViaTwitter(
				'¡Ejercítate de una forma divertida con esta rutina de Efecto Total!', null /* img */, 'http://efectototal.com/videos/cat/'+$stateParams.cat
			);
			break;
		}
	}
	$scope.toggleLists = function(_video){
		selectedVideo = _video;
		User.routines(id, selectedVideo).then(function(data){
			$scope.lists = data;
			$scope.modal.show();
			video.css({display:"none"});
		}, function(error){
			navigator.notification.alert(error, null);
		});
	};
	$scope.cancel = function(){
		$scope.modal.hide();
		video.css({display:"block"});
	}
	$scope.selectedPlaylists = function(){
		var onlist;
		for(var l in $scope.lists){
			var list = $scope.lists[l];
			if(list.selected){
				onlist = true;
				Playlist.add(id, selectedVideo, list.id_playlist);
				History.save({uid: id, data: $scope.videos[0].name, link: '#/app/categoria/'+$stateParams.cat, type: 2});
			}else{
				Playlist.remove(id, selectedVideo, list.id_playlist);
			}
		}
		if(onlist){
			$scope.onlist = true;
			navigator.notification.alert('Esta rutina fue agregada a tus  rutinas exitosamente.', null);
		}
		$scope.modal.hide();
		video.css({display:"block"});
	}
	/*
	$scope.toggleVideo = function(video){
		User.toggle(id, video).then(function(data){
			$scope.onroutine = data;
		});
	}
	*/
	/*
	$scope.$watch('videos', function(){
		if($scope.videos.length > 0){
			Videos.status(id, $scope.videos[0].id_video, ).then(function(data){
				$scope.onroutine = (data.estatus == "0") ? false : true;
			});
		}
	});
	*/
	function onPause(){
		video[0].removeEventListener('pause', onPause);
		video[0].addEventListener('play', onPlay, false);
		CaloricCounter.stop($scope);
	}
	function onPlay(){
		video[0].removeEventListener('play', onPlay, false);
		video[0].addEventListener('pause', onPause, false);
		CaloricCounter.init($scope);
	}
	function onInit(){
		video[0].removeEventListener('play', onInit);
		video[0].pause();
		navigator.notification.confirm('Comenzar a contar calorías. Todas tus calorías se contarán para tus retos.', onConfirm, 'Contador', ['Comenzar','Cancelar']);
		History.save({uid: id, data: $scope.videos[0].name, link: '#/app/categorias/'+$stateParams.cat, type: 1});
	}
	function onConfirm(buttonIndex){
		if(buttonIndex == 1){
			video[0].addEventListener('play', onPlay, false);
			counter = true;
			video[0].play();
		}else{
			counter = false;
			video[0].play();
		}
	}
	function onEnd(){
		if(counter) CaloricCounter.stop($scope);
	}
	Videos.byCategory($stateParams.cat).then(
		function(data){
			video[0].addEventListener('play', onInit, false);
			video[0].addEventListener('ended', onEnd, false);
			$scope.videos = data;
			video.attr("src", "http://efectototal.com/media/" + data[0].src);
			video.attr("poster", "http://efectototal.com/media/" + data[0].thumb2);
		},
		function(){
			navigator.notification.alert("No hay videos disponibles para esta categoría",function(){
			$state.go('app.perfil');
		});
	});
})
.controller('VideoCtrl', function($scope, $state, $stateParams, $interval, $ionicModal, $ionicNavBarDelegate, History, Playlist, CaloricCounter, Videos, User){
	var id = localStorage.getItem('id');
	var video = angular.element(document.querySelector('#exercise-video'));
	var selectedVideo = 0,
		counter = false;
	
	$scope.onlist = false;

	$ionicModal.fromTemplateUrl('templates/select-playlist.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.goBack = function(){
		$ionicNavBarDelegate.back();
	}
	$scope.share = function(sm){
		switch(sm){
			case 'fb':
			//window.open('http://www.facebook.com/sharer.php?u='+'http://efectototal.com/videos/showVideo/'+$stateParams.cat, 'Compartir en Facebook');
			/*
			window.plugins.socialsharing.shareViaFacebook(
				'¡Ejercítate de una forma divertida con esta rutina de Efecto Total!', null /* img , 'http://efectototal.com/videos/showVideo/'+$stateParams.video, 
				function() {console.log('share ok')}, 
				function(errormsg){console.log(errormsg)}
			);
			*/
			facebookConnectPlugin.showDialog({
				method: 'feed',
				link: 'http://efectototal.com/videos/showVideo/'+$stateParams.video,
				caption: '¡Ejercítate de una forma divertida con esta rutina de Efecto Total!'
			}, function(){console.log('shared')}, function(error){console.log(error)});
			break;
			case 'tw':
			//window.open('https://twitter.com/share?url='+'http://efectototal.com/videos/showVideo/'+$stateParams.cat, 'Compartir en Twitter');
			window.plugins.socialsharing.shareViaTwitter(
				'¡Ejercítate de una forma divertida con esta rutina de Efecto Total!', null /* img */, 'http://efectototal.com/videos/showVideo/'+$stateParams.video
			);
			break;
		}
	}
	$scope.toggleLists = function(_video){
		selectedVideo = _video;
		User.routines(id, selectedVideo).then(function(data){
			console.log(data);
			$scope.lists = data;
			$scope.modal.show();
			video.css({display:"none"});
		}, function(error){
			navigator.notification.alert(error, null);
		});
	};
	$scope.cancel = function(){
		$scope.modal.hide();
		video.css({display:"block"});
	}
	$scope.selectedPlaylists = function(){
		var onlist;
		for(var l in $scope.lists){
			var list = $scope.lists[l];
			if(list.selected){
				onlist = true;
				Playlist.add(id, selectedVideo, list.id_playlist);
				History.save({uid: id, data: $scope.video.name, link: '#/app/videos/'+$scope.video.id_video, type: 2});
			}else{
				Playlist.remove(id, selectedVideo, list.id_playlist);
			}
		}
		if(onlist){
			$scope.onlist = true;
			navigator.notification.alert('Esta rutina fue agregada a tus rutinas exitosamente.', null);
		}
		$scope.modal.hide();
		video.css({display:"block"});
	}
	/*
	$scope.toggleVideo = function(video){
		User.toggle(id, video).then(function(data){
			$scope.onroutine = data;
			if($scope.onroutine){
				navigator.notification.alert('Esta rutina fue agregada a tus  rutinas exitosamente.', null);
			}
		});
	}
	*/
	/*
	$scope.$watch('video', function(){
		if($scope.video){
			Videos.status(id, $scope.video.id_video).then(function(data){
				$scope.onlist = (data.estatus == "0") ? false : true;
			});
		}
	});
	*/
	function onPause(){
		video[0].removeEventListener('pause', onPause);
		video[0].addEventListener('play', onPlay, false);
		CaloricCounter.stop($scope);
	}
	function onPlay(){
		video[0].removeEventListener('play', onPlay);
		video[0].addEventListener('pause', onPause, false);
		CaloricCounter.init($scope);	
	}
	function onInit(){
		video[0].removeEventListener('play', onInit);
		video[0].pause();
		navigator.notification.confirm('Comenzar a contar calorías. Todas tus calorías se contarán para tus retos.', onConfirm, 'Contador', ['Comenzar','Cancelar']);
		History.save({uid: id, data: $scope.video.name, link: '#/app/videos/'+$stateParams.cat, type: 1});
	}
	function onEnd(){
		if(counter) CaloricCounter.stop($scope);
	}
	function onConfirm(buttonIndex){
		if(buttonIndex == 1){
			video[0].addEventListener('play', onPlay, false);
			counter = true;
			video[0].play();
		}else{
			counter = false;
			video[0].play();
		}
	}
	Videos.byId($stateParams.video).then(function(data){
		$scope.video = data;
		video.attr("src", "http://efectototal.com/media/" + data.src);
		video.attr("poster", "http://efectototal.com/media/" + data.thumb2);
		video[0].addEventListener('play', onInit, false);
		video[0].addEventListener('ended', onEnd, false);
	});
})
.controller('MisRutinasCtrl', function($scope, $state, User, Playlist, History){
	var id = localStorage.getItem('id');
	$scope.fbid = localStorage.getItem('fbid');
	$scope.goto = function(routine){
		$state.go('app.rutinas-videos',{routine:routine});
	}
	$scope.create = function(){
		navigator.notification.prompt("Nombre de la rutina", function(data){
			if(data.buttonIndex == 1){
				Playlist.create(id, data.input1).then(function(data){
					var length = data.length;
					$scope.routines = data;
					History.save({uid: id, data: $scope.routines[length - 1].name, link: "#app/rutinas", type: 9});
					//History.save({uid: id, data: $scope.routines[length - 1].name, link: "#app/rutinas-videos/"+$scope.routines[length - 1].id_playlist, type: 9});
				},function(error){
					navigator.notification.alert(error, onConfirm)
				});
			}
		},"Mis Rutinas",['Crear','Cancelar']);
	}
	function onConfirm(data){
		console.log(data);
	}
	User.routines(id).then(function(data){
		$scope.routines = data;
	});
})
.controller('RutinasVideosCtrl', function($scope, $state, $stateParams, CaloricCounter, User, Playlist){
	var id = localStorage.getItem('id'),
		rid = $stateParams.routine;
	var video = angular.element(document.querySelector('#all-video')),
		next = 0;
	
	$scope.fbid = localStorage.getItem('fbid');

	$scope.gotoRoutines = function(){
		$state.go('app.categorias',{cat:3});
	}
	$scope.goto = function(video){
		$state.go('app.videos',{video:video});
	}
	$scope.playAll = function(){
		video.css({display:"block"});
		video.attr("src", "http://efectototal.com/media/" + $scope.videos[0].src);
		video[0].addEventListener('ended', playNextVideo, false);
		video[0].addEventListener('pause', onPause, false);
		video[0].play();
		CaloricCounter.init($scope);
		//History.save({uid: id, text: 'Has visto la rutina '+$scope.video.name, link: '#/app/video/'+$scope.video.id_video, type: 1});
	}
	function playNextVideo(){
		next++;
		CaloricCounter.stop($scope);
		if(next < $scope.videos.length){
			video.attr("src", "http://efectototal.com/media/" + $scope.videos[next].src);
			CaloricCounter.init($scope);
			video[0].play();
		}else{
			video.css({display:"none"});
		}
	}
	function onPause(){
		CaloricCounter.stop();
		video.css({display:"none"});
	}
	Playlist.videos(rid).then(function(data){
		$scope.videos = data;
	});
	video.css({display:"none"});
})
.controller('MiActividadCtrl', function($scope, $state, History){
	var id = localStorage.getItem('id'),
		page = 0;
	$scope.fbid = localStorage.getItem('fbid');
	$scope.noMoreItemsAvailable = false;
	$scope.activities = [];
	$scope.loadMore = function(){
		History.get(id, page).then(function(data){
			page++;
			for(a in data){
				var activity = data[a];
				if(activity.data.indexOf(',') > -1){
					activity.data = activity.data.split(",");
				}
			}
			$scope.activities = $scope.activities.concat(data);
			$scope.$broadcast('scroll.infiniteScrollComplete');
		},function(){
			$scope.noMoreItemsAvailable = true;
		});	
	}
	$scope.$on('stateChangeSuccess', function() {
    	$scope.loadMore();
	});
})
.controller('NewsfeedCtrl', function($scope, $state, History){
	var page = 0;
	$scope.fbid = localStorage.getItem('fbid');
	$scope.noMoreItemsAvailable = false;
	$scope.activities = [];
	$scope.loadMore = function(){
		facebookConnectPlugin.api('/me/?fields=friends',[],function(data){
			var _i = 0, _results = [];
			for(_i = 0; _i < data.friends.data.length; _i++){
				_friend = data.friends.data[_i];
				_results.push(_friend.id);
			}
			History.newsfeed(_results.toString(), page).then(function(data){
				page++;
				for(a in data){
					var activity = data[a];
					if(activity.data.indexOf(',') > -1){
						activity.data = activity.data.split(",");
					}
				}
				$scope.activities = $scope.activities.concat(data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
			},function(){
				$scope.noMoreItemsAvailable = true;
			});
		});
	}
	$scope.$on('stateChangeSuccess', function() {
    	$scope.loadMore();
	});
})
.controller('MisRetosCtrl', function($scope, $state, Challenge){
	var id = localStorage.getItem('id'),
		page = 0;
	$scope.fbid = localStorage.getItem('fbid');
	$scope.noMoreItemsAvailable = false;
	$scope.challenges = [];
	$scope.remove = function(index){
		Challenge.update(id, $scope.challenges[index].id_challenge, 0).then(function(){
			$scope.challenges.splice(index, 1);
		});
	}
	$scope.loadMore = function(){
		Challenge.user(id, page).then(function(data){
			page++;
			for(item in data){
				data[item].start_at = new Date(data[item].start_at);
			}
			$scope.challenges = $scope.challenges.concat(data);
			$scope.$broadcast('scroll.infiniteScrollComplete');
		}, function(){
			$scope.noMoreItemsAvailable = true;
		});
	}
	Challenge.won(id).then(function(data){
		console.log(data);
		var all = [], count, result;
		if(data > 50) data = 50;
		result = Math.floor(data/5);
		count = data - result * 5;
		if(data == result *  5) count = 5;
		$scope.level = 'icon-ef-level-' + Math.floor(data/5);
		for(var i = 0; i < count; i++){
			all.push(i);
		}
		$scope.challengeItems = all;
	});
	$scope.$on('stateChangeSuccess', function() {
    	$scope.loadMore();
	});
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
.controller('BlogCtrl', function($scope, $state, $sce, $ionicModal, $timeout, Blog) {
	var page = 1;
	$scope.noMoreItemsAvailable = false;
	$scope.posts = [];
	$ionicModal.fromTemplateUrl('templates/blog-detail.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	$scope.close = function(){
		$scope.modal.hide();
	}
	$scope.open = function(post){
		$scope.post = post;
		$scope.modal.show();
		$timeout(function(){
			anchor = angular.element(document.querySelector('.blogDetail a'));
			anchor.bind('click', function(e){
				e.preventDefault();
				window.open(anchor.attr('href'), '_system', 'location=no');
			});
		}, 1000);
		//window.open(post.url, '_blank', 'location=no');
		//window.open(url, '_system', 'location=no');
	}
	$scope.renderTitle = function(title){
		if(title) return title.replace(/&#8220;/,'"').replace(/&#8221;/,'"').replace(/&#8230;/,'...');
	}
	$scope.renderHTML = function(htmlCode){
		return $sce.trustAsHtml(htmlCode);
	};
	$scope.parseDate = function(dateStr){
		if(dateStr){
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
		}
	};
	$scope.loadMore = function(){
		Blog.posts(page).then(function(data){
			page++;
			$scope.posts = $scope.posts.concat(data);
			$scope.$broadcast('scroll.infiniteScrollComplete');
		}, function(){
			$scope.noMoreItemsAvailable = true;
		});
	}
	$scope.$on('stateChangeSuccess', function() {
    	$scope.loadMore();
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
	$scope.cancel = function(){
		$scope.modal.hide();
	}
	$scope.selectFriends = function(){
		facebookConnectPlugin.api('/me/?fields=friends',[],function(data){
			data.friends.data.push({name:'Sofía Álvarez', id: '1502846876598837'});
			data.friends.data.push({name:'Valeria Sánchez', id: '898876896806662'});
			data.friends.data.push({name:'Ana Carola Rodríguez', id: '359226750892474'});
			data.friends.data.push({name:'Gerardo Rioseco', id: '908737122476769'});
			data.friends.data.push({name:'Flor Escudero', id: '802458749795020'});
			data.friends.data.push({name:'Rodrigo Mayén', id: '721472817889225'});
			$scope.friends = data.friends.data;
			$scope.modal.show();
		});
	}
	$scope.selectedFriends = function(){
		var _selectedFriends;
		_selectedFriends = $scope.friends.filter(function(value, index, arr){
			return value.selected;
		});
		if(_selectedFriends.length > 0){
			$scope.createChallenge();
		}else{
			navigator.notification.alert('Necesitas seleccionar al menos un amigo para comenzar el reto.',alertCallback);
		}
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
		facebookConnectPlugin.showDialog({
			method:'apprequests',
			message:'Te he retado a ejercitarte. ¿Te atreves?',
			to: _results.toString()
		},
		function (data){
			Challenge.create($scope.challenge).then(onSuccess, onError);
		}, function (error){
			Challenge.create($scope.challenge).then(onSuccess, onError);
		});
	}
	function onSuccess(){
		navigator.notification.alert('Tú reto ha sido creado.', alertCallback);
		$state.go('app.retos');
	}
	function onError(error) {
		navigator.notification.alert(error, alertCallback);
	}
	function alertCallback(data){
		console.log(data);
	}
})
.controller('ChallengeInviteCtrl', function($scope, $state, $stateParams, Challenge, History){
	var id = localStorage.getItem('id');
	$scope.fbid = localStorage.getItem('fbid');
	$scope.name = localStorage.getItem('name');
	$scope.accept = function(){
		Challenge.update(id, $stateParams.reto, 1).then(function(data){
			$state.go('app.retos-calendario',{reto: $stateParams.reto});
			History.save({uid: id, data: $scope.challenge.challenge.name+","+$scope.challenge.creator.first_name, link: null, type: 4});
		});
	}
	$scope.decline = function(){
		Challenge.update(id, $stateParams.reto, 0).then(function(data){
			$state.go('app.retos');
			History.save({uid: id, data: $scope.challenge.challenge.name+","+$scope.challenge.creator.first_name, link: null, type: 5});
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
	$scope.gotoRoutines = function(){
		$state.go('app.rutinas');
	}
	function getTotalCurrent(data){
		_totalCurrent = 0;
		if(data.current.calories && data.current.calories.length > 0){
			_length = data.current.calories.length;
			for(_i = 0; _i < _length; _i++){
				_totalCurrent += parseFloat(data.current.calories[_i].calories);
			}
		}
		data.current.total = _totalCurrent;
		data.current.left = data.current.total/data.challenge.calories*90;
		data.current.left = data.current.left <= 90 ? data.current.left : 90;
	}
	function getTotalContenders(data){
		if(!data.contenders){
			navigator.notification.alert('Nadie ha aceptado el reto aún.', function(){
				$state.go('app.retos');
			});
		}
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
				_contender.left = _contender.total/data.challenge.calories*90;
				_contender.left = _contender.left <= 90 ? _contender.left : 90;
			}
		}
	}
	function getWinnersByDate(data){
		var _d;
		var calories, umax, cmax;
		var start_at = data.challenge.start_at.split(' '),
			start_arr = start_at[0].split('-');
		var day, start = new Date(start_arr[0],start_arr[1] - 1,start_arr[2]);//, start = new Date(data.challenge.start_at);
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
					if(_d == 0){
						calendar.push('contender init');
					}else{
						calendar.push('contender');	
					}
				}else if(parseFloat(cmax) == parseFloat(umax)){
					if(_d == 0){
						calendar.push('draw init');
					}else{
						calendar.push('draw');	
					}
				}else{
					if(_d == 0){
						calendar.push('current init');	
					}else{
						calendar.push('current');	
					}
				}
			}else if(_d == data.challenge.days){
				calendar.push('draw end');
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
.controller('ChallengeResultsCtrl', function($scope, $state, $stateParams, Challenge, History){
	var id = localStorage.getItem('id');
	
	$scope.fbid = localStorage.getItem('fbid');
	$scope.name = localStorage.getItem('name');
	
	Challenge.byId(id, $stateParams.reto).then(function(data){
		if(!data.contenders){
			navigator.notification.alert('El reto ha finalizado sin adversarios.', function(){
				$state.go('app.retos');
			});
		}
		$scope.challenge = data;
		$scope.winner = data.current;
		for(var contender in data.contenders){
			if(data.contenders[contender].total > $scope.winner.total) {
				$scope.winner = data.contenders[contender];
			}
		}
		if($scope.winner < data.calories){
			$scope.winner.first_name == "No hay ganador en este reto";
			$scope.winner.total == data.calories;
		}
		if($scope.winner.first_name == data.current.first_name){
			History.save({uid: id, data: $scope.challenge.challenge.name+","+$scope.challenge.contenders[0].first_name, link: null, type: 6});
		}else{
			History.save({uid: id, data: $scope.challenge.challenge.name+","+$scope.challenge.contenders[0].first_name, link: null, type: 7});
		}
	});
})
.controller('CounterCtrl', function($rootScope, $scope, $state, $interval, User, CaloricCounter, History) {
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
	$scope.$on('CaloricCounter.REFRESH', function(e, data){
		$scope.historial = data;
	});
	$scope.toggleCounter = function(){
		if(CaloricCounter.active){
			CaloricCounter.active = false;
			CaloricCounter.stop($scope);
			if($scope.calories > max){
				localStorage.setItem('maxCal', $scope.calories);
			}
			$scope.action = "Iniciar";
			History.save({uid: id, data: $scope.calories, link: null, type: 3});
		}else{
			CaloricCounter.active = true;
			CaloricCounter.init($scope);
			$scope.action = "Detener";
		}
	}
});