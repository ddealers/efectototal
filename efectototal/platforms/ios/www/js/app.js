// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('efectototal', ['ionic', 'openfb', 'efectototal.controllers'])

.run(function($rootScope, $state, $ionicPlatform, $window, OpenFB) {
 	//Init FB
 	OpenFB.init('470325759780426'); // Defaults to sessionStorage for storing the Facebook token
  
 	$ionicPlatform.ready(function() {
    	// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    	// for form inputs)
    	if(window.cordova && window.cordova.plugins.Keyboard) {
      		cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    	}
    	if(window.StatusBar) {
      		// org.apache.cordova.statusbar required
      		StatusBar.styleDefault();
    	}
  	});

  	/*$rootScope.$on('$stateChangeStart', function(event, toState) {
    	if (toState.name !== "app.login" && toState.name !== "app.logout" && !$window.sessionStorage['fbtoken']) {
      		$state.go('app.login');
        	event.preventDefault();
    	}
    });
	$rootScope.$on('OAuthException', function() {
    	$state.go('app.login');
    });*/
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.login', {
      url: "/login",
      views: {
        'menuContent' :{
          templateUrl: "templates/login.html",
          controller: 'LoginCtrl'
        }
      }
    })

    .state('app.logout', {
      url: "/logout",
      views: {
        'menuContent' :{
          templateUrl: "templates/logout.html",
          controller: 'LogoutCtrl'
        }
      }
    })

    .state('app.perfil', {
      url: "/perfil",
      views: {
        'menuContent' :{
          templateUrl: "templates/profile.html"
        }
      }
    })

    .state('app.perfil_actividad', {
      url: "/perfil_actividad",
      views: {
        'menuContent' :{
          templateUrl: "templates/profile_actividad.html"
        }
      }
    })

    .state('app.videos', {
      url: "/videos",
      views: {
        'menuContent' :{
          templateUrl: "templates/videos.html"
        }
      }
    })
    .state('app.sumate', {
      url: "/sumate",
      views: {
        'menuContent' :{
          templateUrl: "templates/sumate.html"
        }
      }
    })

    .state('app.contador', {
      url: "/contador",
      views: {
        'menuContent' :{
          templateUrl: "templates/contador.html",
          controller: 'CounterCtrl'
        }
      }
    })

    .state('app.blog', {
      url: "/blog",
      views: {
        'menuContent' :{
          templateUrl: "templates/blog.html"
        }
      }
    })

    .state('app.equipo', {
      url: "/equipo",
      views: {
        'menuContent' :{
          templateUrl: "templates/equipo.html"
        }
      }
    })

    .state('app.newsfeed', {
      url: "/newsfeed",
      views: {
        'menuContent' :{
          templateUrl: "templates/newsfeed.html"
        }
      }
    })

    .state('app.vidxcategor', {
      url: "/vidxcategor",
      views: {
        'menuContent' :{
          templateUrl: "templates/vidxcategor.html"
        }
      }
    })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/perfil');
});

