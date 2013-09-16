window.Movie = Backbone.Model.extend({

    urlRoot: "/movie",

    idAttribute: "_id",

    initialize: function () {
        this.validators = {};

        this.validators.Title = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.Actors = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a grape variety"};
        };

    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },

    defaults: {
        _id: null,
        Title: "",
        Genre: "",
        Actors: "",
        Director: "",
        Plot: "USA",
        imdbRating: "",
        Poster: null
    }
});

window.MovieCollection = Backbone.Collection.extend({

    model: Movie,

    url: "/movie"

});