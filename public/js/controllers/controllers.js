angular.module('luriflix.controllers',[]).
controller('MovieListController', function($scope, $state, popupService, $window, Movie, TV, Account, toastr){

    $scope.movies = Movie.query();
    $scope.tvs = TV.query();
    
    Account.getProfile()
        .then(function(response) {
          $scope.user = response.data;
        })
        .catch(function(response) {
          toastr.error(response.data.message, response.status);
        });

    $scope.deleteMovie = function(movie){
        if(popupService.showPopup('Really delete this?')){
            movie.$delete(function(){
                $window.location.href = '';
            });
        }
    }
}).controller('MovieViewController', function($scope, $stateParams, Movie){
    $scope.actors = [];
    $scope.movie = [];
    $scope.images = [];

    Movie.get({id: $stateParams.id}, function(data) {
      var actors = data.actors[0];
      $scope.actors = actors;
      $scope.movie = data;
      $scope.images = data.images[0];
    });

}).controller("MovieActorCarouselController", [ function() {
      var ctrl;
      ctrl = this;
      ctrl.members = []

      ctrl.carouselInitializer = function() {
        $("#owl-actors").owlCarousel({
          items: 3,
          navigation: true,
          pagination: true,
          navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]
        });
      };
    }
]).controller("MovieImageCarouselController", [ function() {
      var ctrl;
      ctrl = this;
      ctrl.members = []
      ctrl.carouselInitializer = function() {
        $("#owl-gallery").owlCarousel({
                itemsCustom : [
                [0, 1],
                [450, 1],
                [600, 1],
                [700, 1],
                [1000, 2],
                [1200, 3],
                [1400, 3],
                [1600, 3]
                ],
                navigation : true,
                pagination : true,
                afterInit : function(elem){
                  var that = this
                  that.owlControls.prependTo(elem)
                }
        });
      };
    }
]).controller('MovieCreateController', function($scope, $state, $stateParams, Movie){

    $scope.movie = new Movie();

    $scope.addMovie = function(){
        $scope.movie.$save(function(){
            $state.go('movies');
        });
    }

}).controller('MovieEditController', function($scope, $state, $stateParams, Movie){

    $scope.updateMovie = function(){
        $scope.movie.$update(function(){
            $state.go('movies');
        });
    };

    $scope.loadMovie = function(){
        $scope.movie = Movie.get({id:$stateParams.id});
    };

    $scope.loadMovie();
}).controller('ActorViewController', function($scope, $state, $stateParams, Actor){
    $scope.showActor = true;
    $scope.listLimit = 10;
    $scope.buttonText = "Show More";

    Actor.get({id: $stateParams.id}, function(data) {
        $scope.actor = data;
        $scope.images = data.images.profiles;
        $scope.credits = data.credits;
    });

    $scope.showHideList = function showHideList() {
        if($scope.listLimit == 10) {
            $scope.listLimit = $scope.actor.length;
            $scope.buttonText = "Show Less";
        } else {
            $scope.listLimit = 10;
            $scope.buttonText = "Show More";
        }
    }

     $scope.calculateAge = function calculateAge(birthday) { // birthday is a date
        var birthdate = new Date(birthday);
        var ageDifMs = Date.now() - birthdate.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
}).controller("ActorCarouselController", [ function() {
      var ctrl;
      ctrl = this;
      ctrl.members = []
      ctrl.carouselInitializer = function() {
        $("#owl-gallery").owlCarousel({
                navigation : true,
                pagination : true,
                afterInit : function(elem){
                  var that = this
                  that.owlControls.prependTo(elem)
                }
        });
      };
    }
]).controller('TVViewController', function($scope, $stateParams, TV){
    $scope.actors = [];
    $scope.tv = [];
    $scope.images = [];

    TV.get({id: $stateParams.id}, function(data) {
      $scope.tv = data;
      $scope.images = data.images[0];
    });
});
