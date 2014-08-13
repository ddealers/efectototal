// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('efectototal', ['ionic', 'openfb', 'efectototal.controllers', 'efectototal.services', 'efectototal.directives'])

.run(function($rootScope, $state, $ionicPlatform, $window) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if(window.cordova && window.cordova.plugins.Keyboard) {
		  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
		}
		if(window.StatusBar) {
		  // org.apache.cordova.statusbar required
		  StatusBar.styleDefault();
		}
  	});
  	$rootScope.$on('$stateChangeStart', function(event, toState) {
		if (toState.name !== "login" && !localStorage['id']) {
			$state.go('login');
		 	event.preventDefault();
		}
	});
	/*
	$rootScope.$on('OAuthException', function() {
		$state.go('app.login');
	});
	*/
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

	.state('app', {
	  url: "/app",
	  abstract: true,
	  templateUrl: "templates/menu.html",
	  controller: 'AppCtrl'
	})

	.state('login', {
		url: "/login",
		templateUrl: "templates/login.html",
		controller: 'LoginCtrl'
	})

	.state('app.tour', {
	  url: "/tour",
	  views: {
		'menuContent' :{
		  templateUrl: "templates/tour.html",
		  controller: 'TourCtrl'
		}
	  }
	})

	.state('app.perfil', {
	  url: "/perfil",
	  views: {
		'menuContent' :{
		  templateUrl: "templates/profile.html",
		  controller: 'ProfileCtrl'
		}
	  }
	})
	.state('app.actividad', {
	  url: "/actividad",
	  views: {
		'menuContent' :{
		  templateUrl: "templates/profile.actividad.html",
		  controller: "MiActividadCtrl"
		}
	  }
	})
	.state('app.informacion', {
	  url: "/informacion",
	  views: {
		'menuContent' :{
		  templateUrl: "templates/profile.informacion.html",
		  controller: "ProfileInfoCtrl"
		}
	  }
	})
	.state('app.rutinas', {
	  url: "/rutinas",
	  views: {
		'menuContent' :{
		  templateUrl: "templates/rutinas.html",
		  controller: "MisRutinasCtrl"
		}
	  }
	})
	.state('app.rutinas-videos', {
	  url: "/rutinas-videos/:routine",
	  views: {
		'menuContent' :{
		  templateUrl: "templates/rutinas.videos.html",
		  controller: "RutinasVideosCtrl"
		}
	  }
	})
	.state('app.retos', {
	  url: "/retos",
	  views: {
		'menuContent' :{
		  templateUrl: "templates/retos.html",
		  controller: "MisRetosCtrl"
		}
	  }
	})

	.state('app.retos-iniciar', {
	  url: "/retos-iniciar",
	  views: {
		'menuContent' :{
		  templateUrl: "templates/retos.iniciar.html",
		  controller: "ChallengeInitCtrl"
		}
	  }
	})

	.state('app.retos-invitacion', {
	  url: "/retos-invitacion/:reto",
	  views: {
		'menuContent' :{
		  templateUrl: "templates/retos.invitacion.html",
		  controller: "ChallengeInviteCtrl"
		}
	  }
	})

   .state('app.retos-resultados', {
	  url: "/retos-resultados/:reto",
	  views: {
		'menuContent' :{
		  templateUrl: "templates/retos.resultados.html",
		  controller: "ChallengeResultsCtrl"
		}
	  }
	})

   .state('app.retos-calendario', {
	  url: "/retos-calendario/:reto",
	  views: {
		'menuContent' :{
		  templateUrl: "templates/retos.calendario.html",
		  controller: "ChallengeCalCtrl"
		}
	  }
	})

	.state('app.categorias', {
	  url: "/categorias/:cat",
	  views: {
		'menuContent' :{
		  templateUrl: "templates/videos.categoria.html",
		  controller: 'CategoriesCtrl'
		}
	  }
	})
	.state('app.videos', {
	  url: "/videos/:video",
	  views: {
		'menuContent' :{
		  templateUrl: "templates/videos.id.html",
		  controller: 'VideoCtrl'
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
		  templateUrl: "templates/blog.html",
		  controller: "BlogCtrl"
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
		  templateUrl: "templates/newsfeed.html",
		  controller: "NewsfeedCtrl"
		}
	  }
	})

	.state('app.config', {
	  url: "/config",
	  views: {
		'menuContent' :{
		  templateUrl: "templates/configuracion.html",
		  controller: "ConfigCtrl"
		}
	  }
	})
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/perfil');
});

