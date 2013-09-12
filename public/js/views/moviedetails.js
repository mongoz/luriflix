window.MovieView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
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
