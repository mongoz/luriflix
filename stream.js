var express = require('express'),
  ffmpeg = require('fluent-ffmpeg');
  var logger = require('morgan');
  var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');


var app = express();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('X-HTTP-Method-Override')); 
app.use(express.static(__dirname + '/videoplayer'));

app.get('/', function(req, res) {
  res.send('index.html');
});

app.get('/video', function(req, res) {
  res.contentType('video/flv');
  // make sure you set the correct path to your video file storage
  var pathToMovie = '/mnt/nfs/skynet0/Movies/Argo/argo.avi';
  var proc = ffmpeg(pathToMovie)
    // use the 'flashvideo' preset (located in /lib/presets/flashvideo.js)
     // set video bitrate
    .format('flv')
    .flvmeta()
    .size('320x200')
    .videoBitrate('512k')
    .videoCodec('libx264')
    .fps(24)
    .audioBitrate('96k')
    .audioCodec('aac')
    .audioFrequency(22050)
    .audioChannels(2)

   //.on('start', console.log)

    .on('progress', function(info) {
    console.log('progress ' + info.percent + '%');
  })
    // setup event handlers
    .on('end', function() {
      console.log('file has been converted succesfully');
    })
    .on('error', function(err) {
      console.log('an error happened: ' + err.message);
    })
    // save to stream
    .pipe(res, {end:true});
});

app.listen(3000);
