var express = require('express'),
	app = express(),
	path = require('path'),
	omx = require('omxcontrol'),
	films = require('./js/films');
	dirlist = require('./js/dirlist');
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

var PORT = 3000;

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});

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