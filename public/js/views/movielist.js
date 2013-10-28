window.MovieListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        var movies = this.model.models;
        var len = movies.length;
        var startPos = (this.options.page - 1) * 12;
        var endPos = Math.min(startPos + 12, len);

        $(this.el).html('<ul class="thumbnails"></ul>');

        for (var i = startPos; i < endPos; i++) {
            $('.thumbnails', this.el).append(new MovieListItemView({model: movies[i]}).render().el);
        }

        $(this.el).append(new Paginator({model: this.model, page: this.options.page}).render().el);

        return this;
    }
});

window.MovieListItemView = Backbone.View.extend({

    tagName: "li",

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});
