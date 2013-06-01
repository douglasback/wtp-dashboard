var mysql = require('mysql');
var request = require('request');

module.exports = {
    'syncPetitions': function(res) {
        var client = mysql.createConnection(process.env.DATABASE_URL);
        client.query("SELECT MAX(`created`) as created FROM wtp_data_petitions", function(err, result) {
            getPetitionsCreatedAfter(result[0].created);
        });

        var getPetitionsCreatedAfter = function (timestamp) {
            var apiUrl = "https://api.whitehouse.gov/v1/petitions.json?createdAfter=" + timestamp + "&limit=1000";

            request(apiUrl, function (error, response, body) {
                var body_obj = JSON.parse(body);
                var results = body_obj.results;

                if (!results.length) {
                    res.json(0);
                    return;
                }

                var rows = results.map(function(el, ind, arr){
                    return [el.id, el.title, el.body, el.url, el.deadline, el.signatureThreshold, el.status, el.created];
                });

                var fields = ["id", "title", "body", "url", "deadline", "signature_threshold", "status", "created"];
                var sql = "INSERT IGNORE INTO wtp_data_petitions(" + fields.join(", ")  +") VALUES ?";

                var client = mysql.createConnection(process.env.DATABASE_URL);
                var query = client.query(sql, [rows], function(err, result) {
                    res.json(results.length);
                });
                return;
            });
        };
    },

    'syncSignatures': function(res, petition_id, offset) {
        if (offset) {
            getThousandNewestSignatures(+offset);
        } else {
            var client = mysql.createConnection(process.env.DATABASE_URL);
            client.query("SELECT COUNT(`id`) as signatures FROM wtp_data_signatures WHERE petition_id=?", petition_id, function(er, result){
                getThousandNewestSignatures(result[0].signatures);
            });
        }
        //get stored count


        //get signatures diff
        function getThousandNewestSignatures(storedCount) {
            request("https://api.whitehouse.gov/v1/petitions/" + petition_id +"/signatures.json?offset=" + storedCount + "&limit=1000", function(error, response, body){
                if (!error && response.statusCode == 200) {
                    var body_obj = JSON.parse(body);
                    var results = body_obj.results;
                    var resultset = body_obj.metadata.resultset;
                    var rows_left_after_these = resultset.count - (resultset.offset + resultset.limit);

                    if (!results.length) {
                        res.json(0);
                        return;
                    } //quit; no new results

                    var rows = results.map(function(el, ind, arr){
                        return [el.id, petition_id, el.name, el.zip, el.created, new Date(el.created*1000) ];
                    });

                    var fields = ["id", "petition_id", "name", "zip", "created", "create_dt"];
                    var signature_sync = "INSERT IGNORE INTO wtp_data_signatures(" + fields.join(", ")  +") VALUES ?";

                    var client = mysql.createConnection(process.env.DATABASE_URL);
                    var query = client.query(signature_sync, [rows], function(er, result) {
                        res.json(resultset.offset + resultset.limit);
                    });
                    return;
                }
            });
        }
    }
};

