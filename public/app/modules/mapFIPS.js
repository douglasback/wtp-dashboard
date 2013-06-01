(function () {
// Search module
define([
    // Application.
    'app',
    'modules/petition'
],

// Map dependencies from above array.
function(app, Petition) {

    // Create a new module.
    var Map = app.module();

    // Default View.
    Map.Views.Panel = Backbone.View.extend({
        initialize: function () {
            this.petitionID = this.options.id;
            this.draw();
        },

        draw: function () {
            var $iframe = $('<iframe frameborder="0" scrolling="auto" allowtransparency="true"></iframe>')
                .attr({
                    src: location.origin + '/' + this.petitionID + '/map',
                    width: '1024',
                    height: '768'
                })
                .appendTo(this.$el);
            return this;
        }
    });

    // Return the module for AMD compliance.
    return Map;

});
}());
