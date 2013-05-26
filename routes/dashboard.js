var https = require('https');
    // moment = require('moment');

module.exports = {
    
    index: function(req,res){
        // var env = process.env.ENVIRONMENT === "production" ? 
            
        res.render('dashboard.html', { 
            title: "We the People Dashboard",
            petitionId: req.sanitize('id').xss()
            //scripts: '[typeahead.js]'
            }
        );
    }
};