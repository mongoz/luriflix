window.EditMovieView = Backbone.View.extend({

    initialize:function () {
        this.render();
    },

    render:function () {
       $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
    	"change"		 : "change",
        "click .save"  	 : "beforeSave",
        "click .delete"  : "deleteMovie",
        "drop #picture"  : "drop"
    },

    change: function (event) {
        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};

        change[target.name] = target.value;
        this.model.set(change);

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },

    beforeSave: function () {
        var self = this;
        var check = this.model.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
        this.saveMovie();
        return false;
    },

    saveMovie: function () {
        var self = this;
        this.model.save(null, {
            success: function (model) {
                self.render();
                app.navigate('movie/' + model.id, false);
                utils.showAlert('Success!', 'Movie saved successfully', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    },

    deleteMovie: function () {
        this.model.destroy({
       		success: function () {
       			alert("Movie Deleted");
       			window.history.back();
       		}
    	});
        return false;
    },

    drop: function (event) {
    }
});