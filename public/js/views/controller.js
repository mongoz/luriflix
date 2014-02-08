window.PlayController = Backbone.View.extend({

    className : "controller",

    initialize: function () {
        this.render();
    },

    render: function () {
        data = _.clone(this.model.attributes); 
        $(this.el).html(this.template({model: this.model}));

        return this;
    },

    events: {
        "click #icon"      : "key"
    },

    key: function(e) {
        var button = $(e.currentTarget).attr('class');

        switch(button)
        {
            case "pause":
                this.togglePlayPause(button);
                break;
            case "play":
                this.togglePlayPause(button);
                break;
            case "stop":
                this.stop();
                break;
            case "volume":
                this.volume();
                break;
            default:
                console.log(button);
                socket.emit(button);
                break;
        }

    },

    togglePlayPause: function(p, e) {
       var currClass = $('li.'+ p ).toggleClass('play pause').attr('class');
       socket.emit("pause");
    },

    stop: function () {
       console.log("stop");
       $(".controller").remove();
       $(".controller").unbind();
       socket.emit('stop');
    },

    volume: function() {
        console.log("volym");
    }
});

