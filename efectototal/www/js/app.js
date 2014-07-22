// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('efectototal', ['ionic', 'openfb', 'efectototal.controllers', 'efectototal.services'])

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
  /*
  $rootScope.$on('$stateChangeStart', function(event, toState) {
    if (toState.name !== "app.login" && toState.name !== "app.logout" && !$window.sessionStorage['fbtoken']) {
    	$state.go('app.login');
      event.preventDefault();
    }
  });
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

    .state('app.login', {
      url: "/login",
      views: {
        'menuContent' :{
          templateUrl: "templates/login.html",
          controller: 'LoginCtrl'
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

    .state('app.perfil_informacion', {
      url: "/perfil_informacion",
      views: {
        'menuContent' :{
          templateUrl: "templates/profile_informacion.html",
          controller: "ProfileInfoCtrl"
        }
      }
    })

    .state('app.videos', {
      url: "/videos/:video",
      views: {
        'menuContent' :{
          templateUrl: "templates/videos.html"
        }
      }
    })

    .state('app.vidxcat', {
      url: "/vidxcat",
      views: {
        'menuContent' :{
          templateUrl: "templates/vidxcategor.html"
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

    .state('app.invita', {
      url: "/invita",
      views: {
        'menuContent' :{
          templateUrl: "templates/invita.html",
          controller: 'InviteCtrl'
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

    .state('app.te_reto', {
      url: "/te_reto",
      views: {
        'menuContent' :{
          templateUrl: "templates/te_reto.html"
        }
      }
    })

    .state('app.mis_retos', {
      url: "/mis_retos",
      views: {
        'menuContent' :{
          templateUrl: "templates/mis_retos.html"
        }
      }
    })

   .state('app.resultados_retos', {
      url: "/resultados_retos",
      views: {
        'menuContent' :{
          templateUrl: "templates/resultados_retos.html"
        }
      }
    })

   .state('app.calendario_retos', {
      url: "/calendario_retos",
      views: {
        'menuContent' :{
          templateUrl: "templates/calendario_retos.html"
        }
      }
    })

   .state('app.mis_rutinas', {
      url: "/mis_rutinas",
      views: {
        'menuContent' :{
          templateUrl: "templates/mis_rutinas.html"
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

    .state('app.config', {
      url: "/config",
      views: {
        'menuContent' :{
          templateUrl: "templates/configuracion.html"
        }
      }
    })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/perfil');
});

