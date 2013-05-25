module.exports = {
    
    index: function(req,res){
        // var env = process.env.ENVIRONMENT === "production" ? 
            
        res.render('index.html', { 
            title: "We the People Dashboard",
            scripts: '[typeahead.js]'
            }
        );
    },

	signaturesBy : function(req,res){
		
		var mysql = require('mysql');
		
		var parse  = require('url').parse;
		var grouping = req.params.grouping === "zip" ? "zip" : "create_dt";
		var petition_id = req.params.petition_id;
		var signatures_by_date_sql = 'select ' + grouping +', count(*) as signatures  FROM wtp_data_signatures where petition_id=? group by 1';
		var db_url = parse(process.env.DATABASE_URL);
		var auth = db_url.auth.split(":");
		
		var client = mysql.createConnection({"host": db_url.hostname, "user": auth[0], "password": auth[1], "database": "wtpdashboard"});
		client.query(signatures_by_date_sql, petition_id, function(er, result){
				res.json(result);
		});

	}
};