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

        loadPetitions: function(offset){
            var petitionData = [],
                petitions = [], // this will be an array containing the title and ID
                petitionTitles, // used for the typeahead/autocomplete input
                ENDPOINT = 'https://api.whitehouse.gov/v1/petitions.jsonp';

            $('#spinner').fadeIn();

            var loader = function(offset){
                var offset = offset || 0;
                $.getJSON(ENDPOINT + '?limit=1000&offset=' + offset + '&callback=?', function(data){
                var resultset = data.metadata.resultset,
                    results = data.results;

                petitionData = petitionData.concat(results);
                if (resultset.count - offset > resultset.limit){
                    loader(resultset.offset + resultset.limit + 1);
                } else {
                    console.log(Petition);
                    window.petitions = new Petition.Collection(petitionData);
                    $('#petition-search').typeahead({
                        source: window.petitions.pluck("title"),
                        minLength: 2
                    });
                    $('#spinner').fadeOut();
                }

            });

            }
            loader.call(this);

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
