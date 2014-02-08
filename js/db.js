var nano = require('nano')('http://username:password@localhost:5984'),
	db_name = 'videos',
	db = nano.use(db_name),
	request = require('request');

var IMAGE_PATH = './public/pics/';

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
 
exports.saveToDB = function(data) {
	db.view('videos', 'titles', { startkey: data.Title, endkey: data.Title + "\u9999"}, function(err, body) {
		if(err) {
			console.log(err);
		} else if(body.rows.length === 0) {
			db.insert(data, function(err, body) {
				if(err) {
					console.log(err);
				} else {
					console.log("Data added successfully!");
				}
			});
		} else {
			data._rev = body.rows[0].value.rev;
			 db.insert(data, body.rows[0].id, function(err, body) {
			   	if(err) {
		   			console.log("error: "+ err);
		   		}  else {
	           		console.log(body);
	          	}
			});
		}
	});
}

exports.updateMovie = function(req, res) {
	var id = req.params.id;
	var data = req.body;
	var info;

	if(data.json) {
		info = JSON.parse(data.json);
		info.files = data.files;

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
    	if(error) {
    		console.log(error);
    	} else {
	    	db.destroy(id, body._rev, function(err, body) {
				if (err) {
	            	res.send({'error':'An error has occurred - ' + err});
	        	} else {
	            	res.send(req.body);
	        	}
    		});
		}
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
