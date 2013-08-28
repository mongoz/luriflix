var express = require('express'),
	path = require('path'),
	omx = require('omxcontrol'),
	db = require('./js/db'),
	server = require('http').createServer(app),
	imdb = require('imdb-api'),
	io = require('socket.io').listen(server);

var PORT = 3000;
var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});

db.dirlist();

server.listen(app.get('port'));

console.log('Server listening on port ', app.get('port'));

io.sockets.on('connection', function(socket){

	socket.on('send message', function(data){
		io.sockets.emit('new message', data);
		omx.start('./movie/how.mp4');
	});
	
	socket.on('stop', function(data) {
		omx.quit();
	});
});