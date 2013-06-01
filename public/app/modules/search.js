// Search module
define([
    // Application.
    'app',
    'router'
],

// Map dependencies from above array.
function(app, Router) {

    // Create a new module.
    var Search = app.module();

    // Default Model.
    Search.Model = Backbone.Model.extend({

    });

    // Default Collection.
    Search.Collection = Backbone.Collection.extend({
        model: Search.Model
    });

    // Default View.
    Search.Views.Layout = Backbone.Layout.extend({
        template: "search",
        events: {
            'click #petition-submit' : 'loadPetition'
        },
        
        loadPetition: function(e){
            e.preventDefault();
            Router.navigate("dashboard");
        }
    });

    // Return the module for AMD compliance.
    return Search;

});
