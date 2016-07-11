var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');

var async = require('async');

var colors = require('colors');
var cors = require('cors');

var qs = require('querystring');
var mongoose = require('mongoose');
var request = require('request');

var config = require('./app/config/default');

//var cluster = require('cluster');


// user schema/model
var User = require('./app/models/User.js');

// Connect to DB
mongoose.connect(config.MONGO_URI);
mongoose.connection.on('error', function(err) {
  console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

var app = express();

app.use(favicon(__dirname + '/public/favicon.ico'));
app.locals.appname = 'LuriFlix';
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('X-HTTP-Method-Override')); 
app.use(express.static(path.join(__dirname, 'public')));

var movies = require('./app/routes/movies')(app);
var tv = require('./app/routes/tv')(app);
var auth = require('./app/routes/auth');

app.use('/', auth);

module.exports = app;
