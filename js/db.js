var nano = require('nano')('http://username:password@localhost:5984');
var db_name = 'videos';
var db = nano.use(db_name);
  
exports.findAll = function(req, res) {
	db.view('videos', 'films', function(err, body) {
		if (!err) {
			res.send(body.rows);
		}
	});
}

exports.findById = function(req, res) {
	var id = req.params.id;
	db.get(id, function(err, body) {
		if (!err) {
			res.send(body);
		}
	});
}
 
exports.saveToDB = function (data) {
	db.insert(data, function(err, body) {
		if(err) {
			console.log(err);
		} else {
			console.log("Data added successfully!");
		}
	});
}

exports.delAll = function() {
	/* Delete non-design documents in a database. */
	db.list(function(err, body) {
		if (!err) {
			body.rows.forEach(function(doc) {
				console.log(doc.id);
				 db.destroy(doc.id, doc.value.rev, function(err, body) {
				  if (!err)
					console.log(body);
				}); 
			});
		}
		else {
			console.log(err);
		}
	});
}
