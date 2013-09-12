var express = require('express'),
	path = require('path'),
	omx = require('omxcontrol'),
	db = require('./js/db'),
	imdb = require('./js/imdb'),
	http = require('http'),
	io = require('socket.io');

var app = express();
	
var allowCrossDomain = function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.methodOverride()); 
    app.use(express.static(path.join(__dirname, 'public')));
	app.use(allowCrossDomain);
});

var server = http.createServer(app);
io = io.listen(server);

server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

app.get('/movie', db.findAll);
app.get('/movie/:id', db.findById);
app.get('/delete', db.delAll);
app.put('/movie/:id', db.updateMovie);
app.delete('/movie/:id', db.deleteMovie);
app.get('/save', function(req, res) {
	imdb.readDir(process.env.HOME + '/movies', function(err, film) {
		db.saveToDB(film);
		//console.log(film);
	});
});

io.sockets.on('connection', function(socket) {
	
	socket.on('play', function(data) {
		console.log("start: " + data.Title);
		omx.start(data.loc);
	});

	socket.on('pause', function() {
		console.log("pause");
		omx.pause();
	});

	socket.on('stop', function() {
		console.log("stop");
		omx.quit();
	});

	socket.on('disconnect', function() {
		console.log("Socket disconnected");
	});
});


