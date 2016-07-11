var Movie = require('../models/Movie');

var tmdb = require('../tmdb');
var walker = require('../walker');
var u = require('underscore');


module.exports = function(app) {

  // get all Movies
  app.get('/api/movies', function(req, res) {
    // use mongoose to get all Movies in the database
    Movie.find({}, 'title poster type').lean().exec(function(err, Movies) {
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err)
        res.send(err)

      res.json(Movies); // return all Movies in JSON format
    });
  });

    // get one Movies
  app.get('/api/movies/:movie_id', function(req, res) {
     Movie.findById(req.params.movie_id, function(err, movie) {
        if (err)
          res.send(err);
        res.json(movie);
      });
  });

  // create Movie and send back all Movies after creation
  app.post('/api/movies', function(req, res) {

    // create a Movie, information comes from AJAX request from Angular
    Movie.create({
      text : req.body.text,
      done : false
    }, function(err, Movie) {
      if (err)
        res.send(err);

      // get and return all the Movies after you create another
      Movie.find(function(err, Movies) {
        if (err)
          res.send(err)
        res.json(Movies);
      });
    });

  });

  // delete a Movie
  app.delete('/api/movies/:id', function(req, res) {
    Movie.remove({
      _id : req.params.Movie_id
    }, function(err, Movie) {
      if (err)
        res.send(err);

      // get and return all the Movies after you create another
      Movie.find(function(err, Movies) {
        if (err)
          res.send(err)
        res.json(Movies);
      });
    });
  });

     // get one Movies
  app.get('/api/actor/:actor_id', function(req, res) {
    tmdb.getPersonDetails(req.params.actor_id, function(err, details) {
              if (err) {
                console.log("error:" + err);
              }
              res.send(details);
            });
  });

  app.get('/api/movie/save', function(req, res) {
   var interval = 5 * 1000;
    walker.readDir('/mnt/nfs/skynet0/Movies', function(err, film) {
      for(var i = 0; i < film.files.length; i++) {
        setTimeout( function(i) {
            film.files[i] = u.flatten(film.files[i]);
            film.files[i].sort(function (a, b) {
              return a.toLowerCase().localeCompare(b.toLowerCase());
            });
		          console.log(film.names[i]);
             tmdb.getMovieDetails(film.names[i], film.files[i], function(err, details) {
              if (err) {
                console.log("error: " + err);
              } 

              var newMovie = new Movie();

              // set the user's local credentials
              newMovie.title = details.title;
              newMovie.runtime = details.runtime;
              newMovie.released = details.release_date;
              newMovie.genre = details.genres;
              newMovie.actors = details.actors;
              newMovie.plot = details.overview;
              newMovie.certification = details.certification;
              newMovie.language = details.spoken_languages;
              newMovie.poster = details.poster_path;
              newMovie.backdrop = details.backdrop_path;
              newMovie.rating = details.vote_average;
              newMovie.budget = details.budget;
              newMovie.tmdbID = details.id;
              newMovie.imdbID = details.imdb_id;
              newMovie.type = details.media_type;
              newMovie.images = details.images;
              newMovie.trailer = details.trailer;
              newMovie.files = details.files;
 
              // save the user
              newMovie.save(function(err) {
                if (err){
                  console.log('Error in Saving movie: '+err);  
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
