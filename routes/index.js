module.exports = {
    
    index: function(req,res){
        // var env = process.env.ENVIRONMENT === "production" ? 
            
        res.render('index.html', { 
            title: "We the People Dashboard",
            scripts: '[typeahead.js]'
            }
        );
    },

	map: function(req,res){
		res.render("map.html", { petition_id : req.params.petition_id , layout: false });
	},
	
	twitter : function(req, res){

		var util = require('util'),
		    twitter = require('twitter');
	//	twitter.VERSION = "1.1";
		var twit = new twitter({
		    consumer_key: 'soHHRnSZjpFtuy6lclK8qg',
		    consumer_secret: '8nolGK9pQ4NWRWRTN6nvlytj9nBxI7Pk7gT1UPl5n18',
		    access_token_key: '15648633-2wSKlEcgzEs33MxWMPZkBVmtG9sDPz4liItiuOSo',
		    access_token_secret: 'wamuoe0ohpfcRNjgAY0v0WfRWsILS0yKtQvmWBEyNbY'
		});
		var x = twit.get('/search/tweets.json', {"count":100, q: req.query.q}, function(data) {
		    res.json(data);
		});
		console.log(x);
		
		
	}


};