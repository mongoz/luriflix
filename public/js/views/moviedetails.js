window.MovieView = Backbone.View.extend({

    initialize: function () {

        this.render();
    },

    render: function () {

        data = _.clone(this.model.attributes);

        $(this.el).html(this.template(data));

        if(data.Type == "series") {
            $(this.el).append(new EpisodeView({model: this.model, el: this.$('.files')}));
        } else {
            $(this.el).append(new MovieFileView({model: this.model, el: this.$('.files')}));
        }
        return this;
    },

    events: {
        "click .player" : "showControls"
    },

    showControls: function() {

        $(".footer").html(new PlayController({model: this.model}).el);  
    },
});

window.MovieFileView = Backbone.View.extend({

    initialize: function() {
        this.render();
    },

    render: function() {
        data = _.clone(this.model.attributes); 

        _.each(data.files, function(file, index) {
            $(this.el).append(this.template({part: index + 1 }));
        }, this);
        return this;
    },

    events: {
        "click .player"  : "startMovie",
        
    },

    startMovie: function (e) {
        var part = $(e.currentTarget).text().replace(/[A-Za-z$-]/g, "");
        console.log(data.files[part - 1]);
        socket.emit('info', data.files[part - 1]);
        socket.emit('play', data.files[part - 1]);
    },
});
