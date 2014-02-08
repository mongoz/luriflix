window.EpisodeView = Backbone.View.extend({

    initialize: function () {
        this.model.bind("reset", this.render, this);
        this.found = new Array(new Array());
        this.render();
    },

    render: function () {

        var data = _.clone(this.model.attributes);

        var season = 0;
        var firstSeason = true;
        var s;

         for (var i = 0; i < data.files.length; i++) {
            var filter = data.files[i].match(/S0*(\d+)E0*(\d+)/i, "$1", "$2");
            if (filter != null) {
                if(season < filter[1]) {
                   season = filter[1];
                   if(firstSeason) {
                        $(this.el).html(new SeasonsView({model: season}).render().el);
                        s = season;
                   }
                  $('.dropdown-menu', this.el).append("<li><a tabindex='-1'>" + season + "</a></li>");
                    this.found[season] = new Array();
                    firstSeason = false;
                }
                this.found[season][filter[2]] = data.files[i];
            }
         }
        this.renderEpisodes(s);
        return this;
    },

     events: {
        "click .player" : "play",
        "click .dropdown-menu li" : "selectedSeason"
     },

     play: function(e) {
        var season = parseInt($(".btn:eq(2)").text());
        var episode = parseInt($(e.currentTarget).text());        
        socket.emit('play', this.found[season][episode]);
        socket.emit('info', this.found[season][episode]);
     },

     selectedSeason: function(e) {
        var selected = $(e.currentTarget).text();
        $(".player").remove();
        $(".btn:eq(2)").html(selected + ' <span class="caret"></span>');
        this.renderEpisodes(selected);
     },

     renderEpisodes: function(season) {

         _.each(this.found[season], function(episode, index) {
            $(this.el).append(this.template({num: index, episode: data.Episodes[season][index]}));
         }, this);
     }
});

window.SeasonsView = Backbone.View.extend({

    render: function() {
        $(this.el).html(this.template({season: this.model}));
        return this;
    }
});
