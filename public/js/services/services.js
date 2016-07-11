angular.module('luriflix.services', []).
factory('Movie', function($resource){
    return $resource('/api/movies/:id', {id:'@_id'},{
        update: {
            method: 'PUT'
        }
    });
}).
factory('TV', function($resource){
    return $resource('/api/TV/:id', {id:'@_id'},{
        update: {
            method: 'PUT'
        }
    });
}).
factory('Actor', function($resource) {
    return $resource('/api/actor/:id', {id:'@id'});
})
.service('popupService', function($window){
    this.showPopup = function(message){
        return $window.confirm(message);
    }
});

