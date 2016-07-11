angular.module('luriflix.filters', []).

filter('ageFilter', function() {
     function calculateAge($scope) { // birthday is a date
     	 console.log(scope.birthday);
         var ageDifMs = Date.now() - birthdate.getTime();
         var ageDate = new Date(ageDifMs); // miliseconds from epoch
         return Math.abs(ageDate.getUTCFullYear() - 1970);
     }

     return function($scope) {
           return calculateAge($scope);
     }; 
});
