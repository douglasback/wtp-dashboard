define([
    // Application.
    "app",
    "modules/petition",
    "modules/search",
    "backbone.layoutmanager",
    "underscore"
],

function(app, _, Search, Petition) {

    // Defining the application router, you can attach sub routers here.
    var Router = Backbone.Router.extend({
        routes: {
            "" : "home",
            "/dashboard/:id": "dashboard"
        },
        home: function(){
            var search = new Search.Views.Layout();
            console.log('rendering home');
            $("body").empty().append(search.el);
            search.render();
            // app.useLayout("layouts/main").setViews({
            //     'search': new Search.Views.Layout({

            //     })
            // }).render();
        },
        dashboard: function(id) {
            var petition = new Petition({
                id: id
            });
            $('body').append('<h1>Deal with it</h1>');
        }
    });

    return Router;

});
