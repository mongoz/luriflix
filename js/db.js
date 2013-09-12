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

exports.updateMovie = function(req, res) {
	var id = req.params.id;
	var data = req.body;
	console.log('Updating Movie: ' + id);
    console.log(JSON.stringify(data));

	db.get(id, function (error, existing) {	 	
	  	if(!error) data._rev = existing._rev;
	  	
		  	db.insert(data, id, function(err, body) {
		  		if(err) {
		  			res.send("error: "+ err);
		  		}  else {
	               res.send(data);
	           }
		  	});
	});
}

exports.deleteMovie = function(req, res) {
    var id = req.params.id;
    var data;
    console.log('Deleting Movie: ' + id);

    db.get(id, function(error, body) {
    	if(!error) {
    		console.log(body._rev);
    	}

	    db.destroy(id, body._rev, function(err, body) {
			if (err) {
	            res.send({'error':'An error has occurred - ' + err});
	        } else {
	            res.send(req.body);
	        }
    	});
    });

}

exports.delAll = function() {
	/* Delete non-design documents in a database. */
	db.list(function(err, body) {
		if (!err) {
			body.rows.forEach(function(doc) {
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
