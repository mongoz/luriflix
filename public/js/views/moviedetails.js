window.MovieView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {

        data = _.clone(this.model.attributes); 

        $(this.el).html(this.template(data));

        if(data.Type == "series") {
               $(this.el).append(new EpisodeView({model: this.model, el: this.$('.episodes')}).render());
        }
        return this;
    },

    events: {
        "click .start"  : "startMovie",
        "click .pause"  : "pauseMovie",
        "click .stop"   : "stopMovie",
    },

    startMovie: function () {
        console.log("watch");
         socket.emit('play', this.model);
    },

    pauseMovie: function () {
       console.log("pause");
       socket.emit('pause');
    },

    stopMovie: function () {
       console.log("stop");
       socket.emit('stop');
    },
});
