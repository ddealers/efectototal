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

	//@userData => first_name, last_name, birthday, email, gender, fbid
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
	return {
		create: create
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