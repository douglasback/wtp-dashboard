(function () {

define([
    'app',
    'moment'
],


function(app, moment){

    var Petition = app.module();

    var Model = Backbone.Model.extend({
        defaults: function() {
            return {
                petition: {}
            }
        },
        initialize: function(){
            this.setDaysRemaining();
            this.setProgress();
        },

        setDaysRemaining: function(){
            var deadline = this.get("deadline"),
                now = moment();

            // If petition is still open, calculate days remaining
            if (this.get("status") === "open"){
                this.set({
                    daysRemaining: moment.unix(deadline).diff(now, 'days')
                });
            }
        },
        setProgress: function(){
            var progress;
            progress = (this.get("signatureCount") / this.get("signatureThreshold")) * 100;
            this.set({
                progress: progress
            });
        }
    });

    var Collection = Backbone.Collection.extend({
        model: Model,

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
        template: 'progress',
        tagName: 'div',
        className: 'petition-data',
        serialize: function() {
            return this.model.toJSON();
        }
    });

    // Initialize the collection.

    var petitions = new Collection();

    Petition.get = function () {
        return petitions;
    };

    Petition.load = function (options) {
        // Error out if no endpoint is provided.
        if (!options.uri) {
            throw new Error('Petition: No uri provided to load petition data.');
        }

        var that = this;
        // var petitions = []; // this will be an array containing the title and ID
        // var petitionTitles; // used for the typeahead/autocomplete input
        options.limit = options.limit || 0;
        options.offset = options.offset || 0;
        // Store the success callback in the options. Allow the opportunity to
        // override it.
        options.success = options.success || success;

        /**
         *
         */
        function success (xhr, result, request) {
            var resultset = xhr.metadata.resultset;
            var results = xhr.results;

            // Push data into the collection.
            petitions.add(results);
            // The hard limit on return count is 1000 items. If we hit that limit
            // increment the request frame by 1000 and try to get the next block
            // of results.
            // Only attempt to get more results is the user did not set a limit.
            if (!options.limit && (resultset.count - options.offset > resultset.limit)) {
                options.offset = resultset.offset + resultset.limit + 1;
                loader.call(that, options);
            }
            else {
                (options.callback && options.callback.call(that));
            }
        }

        /**
         * Pulls data via a jsonp request from the provided uri.
         */
        function loader (options) {
            var url = options.uri;
            var success = options.success || null;
            // Build the params.
            var params = {
                offset: options.offset || 0,
                limit: options.limit || 0
            };
            // Load the data.
            $.ajax({
                url: url,
                dataType: 'jsonp',
                data: params,
                success: success
            });
        }

        // Load the data.
        loader.call(this, options);
    };

    return Petition;
});
}());
