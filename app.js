var express = require('express'),
	path = require('path'),
	omx = require('./js/omx'),
	db = require('./js/db'),
	imdb = require('./js/imdb'),
	http = require('http'),
	io = require('socket.io'),
	s = require('./js/sort'),
	u = require('underscore'),
	walker = require('./js/walker');

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
	walker.readDir(process.env.HOME + '/movies', function(err, film) {
		for(var i = 0; i < film.files.length; i++) {
			film.files[i] = u.flatten(film.files[i]);
			film.files[i].sort(function (a, b) {
        		return a.toLowerCase().localeCompare(b.toLowerCase());
     		});
			imdb.getByTitle(film.names[i], film.files[i], function(err, film)  {
				res.send("Data saved!!");
               	db.saveToDB(film);
            });   
		}
	});
});
app.get('/series', function(req, res) {
	walker.readDir(process.env.HOME + '/series', function(err, serie) {
		for(var i = 0; i < serie.files.length; i++) {
			serie.files[i] = u.flatten(serie.files[i]);
			serie.files[i].sort(function (a, b) {
        		return a.toLowerCase().localeCompare(b.toLowerCase());
     		});
			imdb.getByTitle(serie.names[i], serie.files[i], function(err, series)  {
               res.send("Data saved!!");
               db.saveToDB(series);
            });   
		}
	});
});

io.sockets.on('connection', function(socket) {
	
	socket.on('play', function(data) {
		console.log("Playing... ");
		omx.start(data);
	});

	socket.on('pause', function() {
		console.log("pause");
		omx.pause();
	});

	socket.on('stop', function() {
		console.log("stop");
		 omx.stop(function() {});
	});

	socket.on('info', function(data) {
		omx.info(data, function(err, info) {
			socket.emit("info", info)
		});
	});

	socket.on('disconnect', function() {
		console.log("Client disconnected");
	});
});
