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
        model: Search.Model,
        events: {
            'click #petition-submit' : 'loadPetition'
        },

        loadPetition: function(e){
            e.preventDefault();
            var self = this;
            console.log(self.$('#petition-search').val());
            var petitionId = Petition.Collection
                .find(function(petition){
                    return self.$('#petition-search').val() === petition.get("title");
                })
                .get("id");
            app.router.navigate("dashboard/" + petitionId, true);
        }
    });

    // Return the module for AMD compliance.
    return Search;

});
}());
