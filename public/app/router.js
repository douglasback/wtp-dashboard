(function () {
define([
    // Application.
    "app",
    "modules/petition",
    "modules/search",
    "backbone.layoutmanager",
    "underscore",
    "bootstrap-amd"
],

function(app, Petition, Search, Layout, _, Bootstrap) {

    var petitions;

    // Defining the application router, you can attach sub routers here.
    var Router = Backbone.Router.extend({
        routes: {
            "" : "home",
            "dashboard/:id": "dashboard"
        },

        initialize: function(){

        },

        home: function(){
            var search = new Search.Views.Layout();
            console.log('rendering home');
            $("#main").empty().append(search.el);
            search.render();
            this.loadPetitions();
        },

        loadPetitions: function (offset) {
            var endpoint = 'https://api.whitehouse.gov/v1/petitions.jsonp';

            $('#spinner').fadeIn();

            Petition.load({
                uri: endpoint,
                offset: offset,
                limit: 10,
                callback: function () {
                    var petitions = Petition.get();
                    $('#petition-search').typeahead({
                        source: petitions.pluck("title"),
                        minLength: 2
                    });
                    $('#spinner').fadeOut();
                }
            });

        },
        loader: function(offset){

        },
        dashboard: function(id) {
            var petitions = Petition.get();
            var dashboard = new Petition.Views.Dashboard({ model: petitions.get(id) });
            $("#main").empty().append(dashboard.el);
            dashboard.render();

        }
    });

    return Router;

});
}());
