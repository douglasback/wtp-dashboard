module.exports = {
    
    legislator: function(req,res){
			var mysql = require('mysql');

			var grouping = req.params.grouping === "zip" ? "zip" : "create_dt";
			var petition_id = req.params.petition_id;
			var limit = parseInt(req.query.limit, 10) || 10 ; 
			var signatures_by_date_sql = 'select legislator_id, title, firstname, lastname, party, leg.state, leg.district, leg.twitter_id, count(*) as signatures  FROM wtp_data_signatures sig INNER JOIN district dis ON dis.zip=sig.zip INNER JOIN legislator leg ON leg.state=dis.state AND leg.district=dis.district where petition_id=? group by 1 order by signatures desc limit ' + limit;

			var client = mysql.createConnection(process.env.DATABASE_URL);
			client.query(signatures_by_date_sql, petition_id, function(er, result){
					res.json(result);
			});    

    }
};