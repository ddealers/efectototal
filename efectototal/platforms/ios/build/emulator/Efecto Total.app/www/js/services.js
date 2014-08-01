angular.module('efectototal.services', [])

.factory('History', function($rootScope, $state){
	var api = function(request, params, onSuccess, onError, method){
		var url = 'http://efectototal.com/app/index.php';
		var theparams = params || {};
		theparams.q = request;
		if(!method){
			$http.get(url, {params: theparams})
			.success(onSuccess)
			.error(onError);
		}else{
			$http[method](url+request, theparams)
			.success(onSuccess)
			.error(onError);
		}
	}
	var save = function(userData){
		var deferred = $q.defer();
		userData.created_by = userData.id;
		api('/history/save', userData,
		function(response){
			if(response.success){
				deferred.resolve(response.data);
			}else{
				deferred.reject(response.error);
			}
		},function(response){
			deferred.reject(response);
		});
		return deferred.promise;
	}
	return {
		save: save
	}
})
.factory('CaloricCounter', function($rootScope, $state, $interval, User){
	var id = localStorage.getItem('id'), 
		weight = localStorage.getItem('weight'),
		active = false;
	var _acceleration, 
		change = false;
	var counter, secs, mins, zero_secs, zero_mins;
	var weight, calories = 0;

	function onConfirm(){
		$state.go('app.informacion');
	}
	function setMinSecs(){
		if(secs >= 60){
			mins++;
			secs = 0;
		}
		zero_secs = zero(secs);
		zero_mins = zero(mins);
	}
	function zero(num){
		if(num.toString().length < 2){
			return '0'+num;
		}else{
			return num.toString();
		}
	}
	function getCurrentAcceleration(){
		navigator.accelerometer.getCurrentAcceleration(setCaloricCount, onError);
	}
	function setCaloricCount(acceleration){
		var currAcc, prevAcc;
		if(!_acceleration){
			_acceleration = acceleration;
		}
		currAcc = Math.sqrt(Math.pow(acceleration.x,2)+Math.pow(acceleration.y,2)+Math.pow(acceleration.z,2));
		prevAcc = Math.sqrt(Math.pow(_acceleration.x,2)+Math.pow(_acceleration.y,2)+Math.pow(_acceleration.z,2));
		if(currAcc > prevAcc + 1 || currAcc < prevAcc - 1){
			change = true;
			_acceleration = acceleration;
		}
		if(change){
			calories += 0.023 * weight * 2.2 / 60;
			change = false;
		}
	}
	function onError(error){
		console.log(error);
	}
	var init = function(scope){
		weight = localStorage.getItem('weight');
		if(!weight || weight <= 0){
			navigator.notification.alert('Necesitas introducir tu peso correcto antes de comenzar a utilizar el contador de calorías', onConfirm);
		}else{
			counter = $interval(function(){
				secs++;
				setMinSecs();
				getCurrentAcceleration();
				scope.$emit('CaloricCounter.COUNT', calories, zero_secs, zero_mins);
			},1000);
			secs = 0;
			mins = 0;
		}
	}
	var stop = function(scope){
		if (angular.isDefined(counter)) {
			$interval.cancel(counter);
			counter = undefined;
			User.setCalories(id, calories).then(function(data){
				scope.$emit('CaloricCounter.REFRESH', data);
			});
		}
	}
	return {
		active: active,
		init: init,
		stop: stop
	}
})
/*
.factory('CaloricCounter', function($rootScope, $state, $interval, User){
	var id = localStorage.getItem('id'), 
		weight = localStorage.getItem('weight'),
		active = false;
	var counter, secs, mins, zero_secs, zero_mins;
	var weight, calories;

	function onConfirm(){
		$state.go('app.informacion');
	}
	function setCaloricCount(){
		calories = 0.023 * weight * 2.2 * mins + 0.023 * weight * 2.2 * secs/60;
	}
	function setMinSecs(){
		if(secs >= 60){
			mins++;
			secs = 0;
		}
		zero_secs = zero(secs);
		zero_mins = zero(mins);
	}
	function zero(num){
		if(num.toString().length < 2){
			return '0'+num;
		}else{
			return num.toString();
		}
	}
	var init = function(scope){
		weight = localStorage.getItem('weight');
		if(!weight || weight <= 0){
			navigator.notification.alert('Necesitas introducir tu peso correcto antes de comenzar a utilizar el contador de calorías', onConfirm);
		}else{
			counter = $interval(function(){
				secs++;
				setMinSecs();
				setCaloricCount();
				scope.$emit('CaloricCounter.COUNT', calories, zero_secs, zero_mins);
			},1000);
			secs = 0;
			mins = 0;
		}
	}
	var stop = function(scope){
		if (angular.isDefined(counter)) {
			$interval.cancel(counter);
			counter = undefined;
			User.setCalories(id, calories).then(function(data){
				scope.$emit('CaloricCounter.REFRESH', data);
			});
		}
	}
	return {
		active: active,
		init: init,
		stop: stop
	}
})
*/
.factory('Challenge', function($rootScope, $http, $q){
	var api = function(request, params, onSuccess, onError, method){
		var url = 'http://efectototal.com/app/index.php';
		var theparams = params || {};
		theparams.q = request;
		if(!method){
			$http.get(url, {params: theparams})
			.success(onSuccess)
			.error(onError);
		}else{
			$http[method](url+request, theparams)
			.success(onSuccess)
			.error(onError);
		}
	}
	var create = function(userData){
		var deferred = $q.defer();
		userData.created_by = userData.id;
		api('/challenge/create', userData,
		function(response){
			if(response.success){
				deferred.resolve(response.data);
			}else{
				deferred.reject(response.error);
			}
		},function(response){
			deferred.reject(response);
		});
		return deferred.promise;
	}
	var update = function(userID, challengeID, status){
		var deferred = $q.defer();
		api('/challenge/update', {uid: userID, cid: challengeID, status: status},
		function(response){
			if(response.success){
				deferred.resolve(response.data);
			}else{
				deferred.reject(response.error);
			}
		},function(response){
			deferred.reject(response);
		});
		return deferred.promise;
	}
	var byUser = function(userID){
		var deferred = $q.defer();
		api('/challenge/user', {id: userID},
		function(response){
			if(response.success){
				deferred.resolve(response.data);
			}else{
				deferred.reject(response.error);
			}
		},function(response){
			deferred.reject(response);
		});
		return deferred.promise;
	}
	var byId = function(userID, challengeID){
		var deferred = $q.defer();
		api('/challenge/id', {uid: userID, cid: challengeID},
		function(response){
			if(response.success){
				deferred.resolve(response.data);
			}else{
				deferred.reject(response.error);
			}
		},function(response){
			deferred.reject(response);
		});
		return deferred.promise;
	}
	return {
		create: create,
		update: update,
		user: byUser,
		byId: byId
	}	
})
.factory('Playlist', function($rootScope, $http, $q){
	var api = function(request, params, onSuccess, onError, method){
		var url = 'http://efectototal.com/app/index.php';
		var theparams = params || {};
		theparams.q = request;
		if(!method){
			$http.get(url, {params: theparams})
			.success(onSuccess)
			.error(onError);
		}else{
			$http[method](url+request, theparams)
			.success(onSuccess)
			.error(onError);
		}
	}
	var create = function(id, name){
		var deferred = $q.defer();
		api('/user/create', {id: id, name: name},
		function(response){
			if(response.success){
				deferred.resolve(response.data);
			}else{
				deferred.reject(response.error);
			}
		},function(response){
			deferred.reject(response);
		});
		return deferred.promise;
	}
})
.factory('User', function($rootScope, $http, $q){
	var api = function(request, params, onSuccess, onError, method){
		var url = 'http://efectototal.com/app/index.php';
		var theparams = params || {};
		theparams.q = request;
		if(!method){
			$http.get(url, {params: theparams})
			.success(onSuccess)
			.error(onError);
		}else{
			$http[method](url+request, theparams)
			.success(onSuccess)
			.error(onError);
		}
	}

	var create = function(userData){
		var deferred = $q.defer();
		userData.fbid = userData.id;
		api('/user/create', userData,
		function(response){
			if(response.success){
				deferred.resolve(response.data);
			}else{
				deferred.reject(response.error);
			}
		},function(response){
			deferred.reject(response);
		});
		return deferred.promise;
	}
	var setCalories = function(user, calories){
		var deferred = $q.defer();
		api('/user/set_calories', {user: user, calories: calories},
		function(response){
			if(response.success){
				deferred.resolve(response.data);
			}else{
				deferred.reject(response.error);
			}
		},function(response){
			deferred.reject(response);
		});
		return deferred.promise;
	}
	var getCalories = function(user){
		var deferred = $q.defer();
		api('/user/calories', {user: user},
		function(response){
			if(response.success){
				deferred.resolve(response.data);
			}else{
				deferred.reject(response.error);
			}
		},function(response){
			deferred.reject(response);
		});
		return deferred.promise;
	}
	var routines = function(user){
		var deferred = $q.defer();
		api('/user/routines', {user: user},
		function(response){
			if(response.success){
				deferred.resolve(response.data);
			}else{
				deferred.reject(response.error);
			}
		},function(response){
			deferred.reject(response);
		});
		return deferred.promise;
	}
	var toggleVideo = function(user, video){
		var deferred = $q.defer();
		api('/user/toggle_video', {user: user, video: video},
		function(response){
			if(response.success){
				deferred.resolve(response.status);
			}else{
				deferred.reject(response.error);
			}
		},function(response){
			deferred.reject(response);
		});
		return deferred.promise;
	}
	return {
		create: create,
		calories: getCalories,
		setCalories: setCalories,
		toggle: toggleVideo,
		routines: routines
	}
})
.factory('Videos', function($rootScope, $http, $q){
	var api = function(request, params, onSuccess, onError, method){
		var url = 'http://efectototal.com/app/index.php';
		var theparams = params || {};
		theparams.q = request;
		if(!method){
			$http.get(url, {params: theparams})
			.success(onSuccess)
			.error(onError);
		}else{
			$http[method](url+request, theparams)
			.success(onSuccess)
			.error(onError);
		}
	}
	var categories = function(){
		var deferred = $q.defer();
		api('/video/categories', {},
		function(response){
			if(response.success){
				deferred.resolve(response.data);
			}else{
				deferred.reject(response.error);
			}
		},function(response){
			deferred.reject(response);
		});
		return deferred.promise;
	}
	var byCategory = function(category){
		var deferred = $q.defer();
		api('/video/by_category', {cat: category},
		function(response){
			if(response.success){
				deferred.resolve(response.data);
			}else{
				deferred.reject(response.error);
			}
		},function(response){
			deferred.reject(response);
		});
		return deferred.promise;
	}
	var byId = function(id){
		var deferred = $q.defer();
		api('/video/by_id', {id: id},
		function(response){
			if(response.success){
				deferred.resolve(response.data);
			}else{
				deferred.reject(response.error);
			}
		},function(response){
			deferred.reject(response);
		});
		return deferred.promise;
	}
	var status = function(user, video){
		var deferred = $q.defer();
		api('/video/status', {uid: user, vid: video},
		function(response){
			if(response.success){
				deferred.resolve(response.data);
			}else{
				deferred.reject(response.error);
			}
		},function(response){
			deferred.reject(response);
		});
		return deferred.promise;
	}
	return {
		categories: categories,
		byCategory: byCategory,
		byId: byId,
		status: status
	}
})
.factory('Blog', function($rootScope, $http, $q){
	var url = 'http://blog.efectototal.com';
	var posts = function(){
		var deferred = $q.defer();
		$http.get(url, {params: {json:1}})
		.success(function(response){
			if(response.status === "ok"){
				deferred.resolve(response.posts);
			}
		})
		.error(function(response){
			deferred.reject(response);
		});
		return deferred.promise;
	}
	return {
		posts: posts
	}
});