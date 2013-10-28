window.Movie = Backbone.Model.extend({

    urlRoot: "/movie",

    idAttribute: "_id"
});

window.MovieCollection = Backbone.Collection.extend({

    model: Movie,

    url: "/movie"

});