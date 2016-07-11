var TV = require('../models/TV');

var tmdb = require('../tmdb');
var walker = require('../walker');
var u = require('underscore');

module.exports = function(app) {

	app.get('/api/TV', function(req, res) { 
		TV.find({}, 'title poster type').lean().exec(function(err, tv) {
	      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
	      if (err)
	        res.send(err)

	      res.json(tv); // return all Movies in JSON format
    	});
	});

	app.get('/api/TV/:tv_id', function(req, res) { 

 		TV.findById(req.params.tv_id, function(err, tv) {
        	if (err)
          		res.send(err);
        	res.json(tv);
      	});
	});                                                                                                                                                                                                                         

  	app.get('/api/TVs/save', function(req, res) {
    
    var interval = 5 * 1000;
    walker.readDir('/mnt/nfs/skynet0/Series', function(err, film) {
      for(var i = 0; i < film.files.length; i++) {
        setTimeout( function(i) {
            film.files[i] = u.flatten(film.files[i]);
            film.files[i].sort(function (a, b) {
              return a.toLowerCase().localeCompare(b.toLowerCase());
            });
            console.log(film.names[i]);
            tmdb.getTVDetails(film.names[i], film.files[i], function(err, details) {
                if (err) {
                  console.log("error: " + err);
                } 

                var newTV = new TV();

               // console.log(details);

                // set the user's local credentials
                newTV.title = details.original_name;
                newTV.runtime = details.episode_run_time;
                newTV.released = details.first_air_date;
                newTV.genre = details.genres;
                newTV.actors = details.credits;
                newTV.plot = details.overview;
                newTV.certification = details.certification;
                newTV.language = details.origin_language;
                newTV.poster = details.poster_path;
                newTV.backdrop = details.backdrop_path;
                newTV.rating = details.vote_average;
                newTV.budget = details.budget;
                newTV.tmdbID = details.id;
                newTV.type = details.media_type;
                newTV.images = details.images;
                newTV.files = details.files;
                newTV.created_by = details.created_by;
                newTV.status = details.status;
                newTV.networks = details.networks;
                newTV.number_of_episodes = details.number_of_episodes;
                newTV.number_of_seasons = details.number_of_seasons;
                newTV.seasons = details.seasons;
                newTV.seasonInfo = details.seasonInfo;
   
                // save the user
                newTV.save(function(err) {
                  if (err){
                    console.log('Error in Saving TV show: '+err);  
                    throw err;  
                  }
                  console.log('Movie added succesful');
                });
          });
        }, interval * i, i);
      }
    });
  });
};
