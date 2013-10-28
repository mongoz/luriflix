var nano = require('nano')('http://username:password@localhost:5984'),
	db_name = 'videos',
	db = nano.use(db_name),
	request = require('request');

exports.findAll = function(req, res) {
	var name = req.query['name'];

	if (name) {
		db.view('videos', 'all', { startkey: name, endkey: name + "\u9999"}, function(err, body) {
			if(!err) {
				res.send(body.rows);
			} else {
				console.log(err);
			}
		});

	} else {

		db.view('videos', 'all', function(err, body) {
			if (!err) {
				res.send(body.rows);
			}
		});
	}
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
	var info;

	if(data.json) {
		info = JSON.parse(data.json);
		info.loc = data.loc;

		try {
        	request(info.Poster).pipe(fs.createWriteStream(IMAGE_PATH + info.imdbID + '.png'));
        } catch(err) {
       	 	console.log(err);
    	}
	} else {
		info = data;
	}

	console.log('Updating Movie: ' + id);

	db.get(id, function (error, existing) {	 	
	  	if(!error) info._rev = existing._rev;	  	
		  	db.insert(info, id, function(err, body) {
		  		if(err) {
		  			res.send("error: "+ err);
		  		}  else {
	               res.send(info);
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
