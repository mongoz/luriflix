var express = require('express'),
	app = express(),
	path = require('path'),
	http = require('http'),
	omx = require('omxcontrol'),
	db = require('./js/db'),
	imdb = require('./js/imdb');

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/films', db.findAll);
app.get('/films/:id', db.findById);
app.get('/delete', db.delAll);
app.get('/save', function(req, res) {
	imdb.movieList('./movie', function(err, film) { 
		db.saveToDB(film);
	})
});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
