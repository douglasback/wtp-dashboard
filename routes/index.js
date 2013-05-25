module.exports = {
    
    index: function(req,res){
        // var env = process.env.ENVIRONMENT === "production" ? 
            
        res.render('index.html', { 
            title: "We the People Dashboard",
            scripts: '[typeahead.js]'
            }
        );
    },

	signaturesByDate : function(req,res){
		
		var mysql = require('mysql');
		
		var parse  = require('url').parse;
		var petition_id = req.query.petition_id;
		var signatures_by_date_sql = 'select create_dt, count(*) as signatures  FROM wtp_data_signatures where petition_id=? group by create_dt';
		var db_url = parse(process.env.DATABASE_URL);
		var auth = db_url.auth.split(":");
		
		var client = mysql.createConnection({"host": db_url.hostname, "user": auth[0], "password": auth[1], "database": "wtpdashboard"});
		client.query(signatures_by_date_sql, petition_id, function(er, result){
				res.json(result);
		});

	}
};