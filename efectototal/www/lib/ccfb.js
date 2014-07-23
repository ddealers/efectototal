angular.module('ccfb', [])

.factory('CCFB', function ($rootScope, $q, $window, $http) {
    var plugin,
    runningInCordova;

    document.addEventListener("deviceready", function () {
        plugin = new CC.CordovaFacebook();
        runningInCordova = true;
    }, false);

    var init = function(appId, appName, scope) {
        plugin.init(appId, appName, scope,function(response){
            if(response) {
                console.log("Access token is: " + response.accessToken);
                console.log("Expires: " + response.expirationDate);
                console.log("Permissions are: " + response.permissions);
            }
        });
    }

    var login = function(){
        var deferred = $q.defer();
        plugin.login(function(response){
            deferred.resolve(response);
        },function(response){
            deferred.reject(response);
        });
        return deferred.promise;
    }

    return{
        init: init,
        login: login
    }
});