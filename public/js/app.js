angular.module('luriflix', ['ui.router', 'ngResource', 'luriflix.controllers', 'luriflix.services', 
  'luriflix.directives', 'ocNgRepeat', 'mgcrea.ngStrap.scrollspy', 
  'mgcrea.ngStrap.helpers.dimensions', 'toastr', 'satellizer', 'ngMessages', 'ngAnimate'])

.config(function($stateProvider, $urlRouterProvider, $authProvider){

    $stateProvider.state('movies',{
        url: '/browse',
        templateUrl: 'partials/movies.html',
        controller: 'MovieListController',
        resolve: {
          loginRequired: loginRequired
        }
    })
    .state('viewMovie',{
       url:'/movies/:id',
       templateUrl: 'partials/movie-details.html',
       controller: 'MovieViewController',
       resolve: {
          loginRequired: loginRequired
        }
    })
    .state('newMovie',{
        url: '/movies/new',
        templateUrl: 'partials/movie-add.html',
        controller: 'MovieCreateController',
        resolve: {
          loginRequired: loginRequired
        }
    })
    .state('editMovie',{
        url: '/movies/:id/edit',
        templateUrl: 'partials/movie-edit.html', 
        controller: 'MovieEditController',
        resolve: {
          loginRequired: loginRequired
        }
    })
    .state('viewTV',{
       url:'/tv/:id',
       templateUrl: 'partials/tv-details.html',
       controller: 'TVViewController',
       resolve: {
          loginRequired: loginRequired
        }
    })
    .state('viewActor',{
       url:'/actor/:id',
       templateUrl: 'partials/actor.html',
       controller: 'ActorViewController',
      resolve: {
          loginRequired: loginRequired
        }
    })
    .state('login', {
        url: '/',
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'partials/signup.html',
        controller: 'SignupCtrl',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
      })
      .state('logout', {
        url: '/logout',
        template: null,
        controller: 'LogoutCtrl'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'partials/profile.html',
        controller: 'ProfileCtrl',
        resolve: {
          loginRequired: loginRequired
        }
      });

    $urlRouterProvider.otherwise('/');

    function skipIfLoggedIn($q, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.reject();
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }

    function loginRequired($q, $location, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.resolve();
      } else {
        $location.path('/login');
      }
      return deferred.promise;
    }

});
