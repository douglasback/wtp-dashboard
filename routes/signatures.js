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
		var signatures_by_date_sql = 'SELECT z2f.fip, count(*) as signatures ' +
									 'FROM wtp_data_signatures sig ' +
									 'INNER JOIN zip_to_fip z2f ON sig.zip=z2f.zipcode ' +
									 'WHERE petition_id=? GROUP BY z2f.fip';

		var client = mysql.createConnection(process.env.DATABASE_URL);
		var query = client.query(signatures_by_date_sql, petition_id, function(er, result){
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

	
	sync : function(req, res){
		
		var request = require('request');
	    var mysql = require('mysql');
		var petition_id = req.params.petition_id;
		
	
		if(req.query.offset){
			getThousandNewestSignatures(+req.query.offset);
		}else{
			var client = mysql.createConnection(process.env.DATABASE_URL);
			client.query("SELECT COUNT(`id`) as signatures FROM wtp_data_signatures WHERE petition_id=?", petition_id, function(er, result){
				getThousandNewestSignatures(result[0].signatures);
			});
			
		}
		//get stored count
		
		
		//get signatures diff
		function getThousandNewestSignatures(storedCount){
			request("https://api.whitehouse.gov/v1/petitions/" + petition_id +"/signatures.json?offset=" + storedCount + "&limit=1000", function(error, response, body){
				if (!error && response.statusCode == 200) {
					var body_obj = JSON.parse(body);
					var results = body_obj.results;
					var resultset = body_obj.metadata.resultset;
					var rows_left_after_these = resultset.count - (resultset.offset + resultset.limit);
					if(!results.length){ res.json(0); return; } //quit; no new results
					
					 var rows = results.map(function(el, ind, arr){ 
						return [el.id, petition_id, el.name, el.zip, el.created, new Date(el.created*1000) ];
					});
					 var fields = ["id", "petition_id", "name", "zip", "created", "create_dt"];
					 var signature_sync = "INSERT IGNORE INTO wtp_data_signatures(" + fields.join(", ")  +") VALUES ?";
					
					var client = mysql.createConnection(process.env.DATABASE_URL);
					var query = client.query(signature_sync, [rows], function(er, result){
							res.json(resultset.offset + resultset.limit); 
					});
					console.log(query.sql);
				//	res.json({rows:rows, sql:query.sql});
					
				}
			});
		}
				
	}

};