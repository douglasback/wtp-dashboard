define([
    'app',
],


function(app){
    var Petition = app.module();

    Petition.Model = Backbone.Model.extend({
        defaults: function() {
            return {
                petition: {}
            }
        }
    });

    Petition.Collection = Backbone.Collection.extend({
        model: Petition.Model,

        url: function(){
            return "http://api.whitehouse.gov/petition.jsonp?" + this.id  + "callback=?";
        }
    });

    Petition.Views.Info = Backbone.View.extend({
        template: '',
        tagName: 'div',


    });
    Petition.Views.Dashboard = Backbone.View.extend({
        template: 'dashboard',
        tagName: 'div',
        serialize: function() {
            return this.model.toJSON();
        }

    });
    Petition.Views.Progress = Backbone.View.extend({
        template: '',
        tagName: 'div'
    });

    return Petition;
});