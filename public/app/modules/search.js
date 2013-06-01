// Search module
define([
  // Application.
  'app',
  'modules/petition',
  'backbone',
  'underscore',
  'backbone.layoutmanager'
],

// Map dependencies from above array.
function(app, _, Backbone, LayoutManager) {

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
        manage: true
        
    });

    // Return the module for AMD compliance.
    return Search;

});
