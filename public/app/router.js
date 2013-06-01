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
                limit: null,
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
            console.log(id);
            console.log(petitions.get(id));
            var dashboard = new Petition.Views.Dashboard({ model: petitions.get(id) });
            console.log("rendering dashboard");
            $("#main").empty().append(dashboard.el);
            dashboard.render();

        }
    });
    return Router;

});
}());
