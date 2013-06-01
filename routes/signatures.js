module.exports = {

	signaturesByDateChart : function(req,res){
		var mysql = require('mysql');

		var grouping = "create_dt";
		var petition_id = req.params.petition_id;
		var signatures_by_date_sql = 'select ' + grouping +', count(*) as signatures  FROM wtp_data_signatures where petition_id=? group by 1';

		var client = mysql.createConnection(process.env.DATABASE_URL);
		client.query(signatures_by_date_sql, petition_id, function(er, result){

		var counter = 0;
		var data =	[{
		    "key" : "Signatures" ,
		    "bar": true,
		    "values" :[]
		  },
		  {
		    "key" : "Total" ,
		    "values" : []
		  }];
		 for(var i=0; i<result.length; i++){
			var date = +result[i].create_dt;
			var sigs = result[i].signatures;
			counter += sigs;
			data[0].values.push([date, sigs]);
			data[1].values.push([date, counter]);
		 }
		  res.render("datechart.html", {
				data : JSON.stringify(data)
				, layout: false
			});
		});

	},

	fips : function(req,res){

		var mysql = require('mysql');

		var grouping = req.params.grouping === "zip" ? "zip" : "create_dt";
		var petition_id = req.params.petition_id;
		var signatures_by_fips_sql = 'SELECT fips fip, IFNULL(signatures,0) signatures FROM (SELECT z2f.fip, count(*) as signatures FROM wtp_data_signatures sig INNER JOIN zip_to_fip z2f ON sig.zip=z2f.zipcode  WHERE petition_id=? GROUP BY z2f.fip) x RIGHT JOIN fips ON fips=fip;';

		var client = mysql.createConnection(process.env.DATABASE_URL);
		var query = client.query(signatures_by_fips_sql, petition_id, function(er, result){
				var tsv = ["id\tsignatures"];

				for(var i = 0; i<result.length; i++){
					tsv.push(result[i].fip+"\t"+result[i].signatures);
				}
				tsv = tsv.join("\n");
			  	res.setHeader('Content-Type', 'text/plain');
			  	res.setHeader('Content-Length', tsv.length);
				res.end(tsv);
		});
		console.log(query);
	},


	signaturesBy : function(req,res){

		var mysql = require('mysql');

		var grouping = req.params.grouping === "zip" ? "zip" : "create_dt";
		var petition_id = req.params.petition_id;
		var signatures_by_date_sql = 'select ' + grouping +', count(*) as signatures  FROM wtp_data_signatures where petition_id=? group by 1';

		var client = mysql.createConnection(process.env.DATABASE_URL);
		client.query(signatures_by_date_sql, petition_id, function(er, result){
				res.json(result);
		});

	},


	sync : function(req, res) {
		var sync = require('../lib/sync');
		var petition_id = req.params.petition_id;
		var offset = req.query.offset;

		return sync.syncSignatures(res, petition_id, offset);
	}
};