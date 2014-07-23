angular.module('efectototal.services', [])

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
		toggle: toggleVideo
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