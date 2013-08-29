var cradle = require('cradle'),
	request = require('request');
	
var db = new (cradle.Connection)('http://localhost', 5984, {
    auth: { username: 'username', password: 'password!' },
	cache: true,
	raw: false
}).database('videos');
  
db.exists(function (err, exists) {
	if (err) {
		console.log('error', err);
	} else if (exists) {
		console.log('Database does exist');
	} else {
		console.log('Database does not exist.');
		db.create();
		/* populate design documents */
	}
});
	
/* db.view('videos/wines', function (err, res) {
      res.forEach(function (row) {
          console.log(row.wines);
      });
});
 */
 

 function imdbData(film) {
	request('http://omdbapi.com/?t=' + film, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
		var parsed = JSON.parse(body);
		console.log(parsed.Actors); 
	  }
	});
 }
 
 imdbData("The Avengers");

function saveToDB (url,name) {
	
	db.save(name ,{
    name: name, url: url
	}, function (err, res) {
		if(err) {
			console.log(err);
		}
	});
};

var dirlist = function() {
	var walk    = require('walk');

	// Walker options
	var walker  = walk.walk('./movie', { followLinks: false });

	walker.on('file', function(root, stat, next) {

		var str = stat.name;
		name = str.replace(/\.[^\.]*(?:hdtv|x264)[^\.]*/ig,"").replace(/\.[^\.]*$/,"").replace(/\./g," ");
		
		//test2(root + '/' + stat.name, str);
		console.log("movie name: " + name);
		
		next();
	});
	
};
  
exports.dirlist = dirlist;