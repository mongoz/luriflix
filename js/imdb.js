var walk    = require('walk'),
	request = require('request');

exports.movieList = function(dir, callback) {
	
	var walker  = walk.walk(dir, { followLinks: false });

	walker.on('file', function(root, stat, next) {

		var str = stat.name;
		name = str.replace(/\.[^\.]*(?:hdtv|x264)[^\.]*/ig,"").replace(/\.[^\.]*$/,"").replace(/\./g," ");
		
		imdbData(name, function(err, film)  {
			callback(null, film);
		});
		next();
	});
}

function imdbData(film, callback) {

	request('http://omdbapi.com/?t=' + film, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
		parsed = JSON.parse(body);
		callback(null, parsed);
	  }
	  else {
		callback(error);
	  }
	});
}
