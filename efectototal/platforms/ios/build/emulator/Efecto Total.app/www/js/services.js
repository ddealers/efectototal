angular.module('efectototal.services', [])

.factory('CaloricCounter', function($rootScope, $state, $interval, User){
	var id = localStorage.getItem('id'), 
		weight = localStorage.getItem('weight'),
		active = false;
	var counter, secs, mins, zero_secs, zero_mins;
	var weight, calories;

	function onConfirm(){
		console.log('Error', 'No peso');
		$state.go('app.perfil_informacion');
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
	var init = function(scope){
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
	var stop = function(){
		if (angular.isDefined(counter)) {
			$interval.cancel(counter);
			counter = undefined;
			User.setCalories(id, calories);
		}
	}
	return {
		active: active,
		init: init,
		stop: stop
	}

})
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
				deferred.resolve(response.status);
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