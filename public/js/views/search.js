window.SearchView = Backbone.View.extend({
    tagName:'ul',

    className:'nav nav-list',

    initialize:function () {
        var self = this;
        this.model.on("reset", this.render, this);
        this.model.on("add", function (movie) {
            self.$el.append(new SearchListView({model:movie}).render().el);
        });
    },

    render:function () {
        this.$el.empty();
        _.each(this.model.models, function (movie) {
            this.$el.append(new SearchListView({model:movie}).render().el);
        }, this);
        return this;
    }
});

window.SearchListView = Backbone.View.extend({

    tagName:"li",

    initialize:function () {
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);
    },

    render:function () {
        var data = _.clone(this.model.attributes);
        this.$el.html(this.template(data));
        return this;
    }

});