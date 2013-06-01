(function () {
define([
    // Application.
    "app",
    "modules/dashboard",
    "modules/petition",
    "modules/search",
    "modules/mapFIPS",
    "modules/chart",
    "backbone.layoutmanager",
    "underscore",
    "bootstrap-amd"
],

function(app, Dashboard, Petition, Search, MapFIPS, Chart, Layout, _, Bootstrap) {

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
            var $container = $('<div class="dashboard">');
            $('#main').empty().append($container);
            var petitions = Petition.get();
            var petition = petitions.get(id);
            petition.getShares();
            var dashboard = new Dashboard.Views.Dashboard({
                el: $container
            });
            
            dashboard.registerPanel(Petition.Views.Panel, {model: petition});
            dashboard.registerPanel(MapFIPS.Views.Panel, {id: petition.get('id')});
            dashboard.registerPanel(Chart.Views.Panel, {id: petition.get('id')});
            dashboard.registerPanel(Petition.Views.Progress, { model: petitions.get(id) });
            dashboard.registerPanel(Petition.Views.Social, { model: petitions.get(id) })
        }
    });
    return Router;

});
}());
