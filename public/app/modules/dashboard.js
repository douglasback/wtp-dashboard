(function () {

define([
    'app',
    "underscore",
],


function(app, _){

    var panels = [];

    var Dashboard = app.module();

    Dashboard.Views.Dashboard = Backbone.View.extend({
        registerPanel: function (PanelView, options) {
            var $panel = $('<div class="panel">');
            this.$el.append($panel);
            options = _.extend({
                // model: Model,
                el: $panel
            }, options);
            // Create a new view
            panels.push(new PanelView(options));
        },
        remove: function () {
            // Remove the panels.
            Backbone.View.prototype.remove.call(this);
        }
    });

    return Dashboard;
});
}());
