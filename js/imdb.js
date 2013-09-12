var request = require('request'),
	fs = require('fs'),
	path = require('path');

var IMAGE_PATH = './public/pics/';
var MOVIE_PATH = process.env.HOME + '/movies';
var SERIES_PATH = process.env.HOME + '/series';

function imdbData(film, loc, callback) {
	request('http://omdbapi.com/?t=' + film, function (error, response, body) {
	   if (!error && response.statusCode == 200) {
	      var parsed = JSON.parse(body);

            if(parsed.Error) {
                request('http://omdbapi.com/?s=' + film, function(error, response, body) {
                    if(!error && response.statusCode == 200) {
                       var parse = JSON.parse(body);
                        if(parse.Error) {
                            console.log("error:" + film);
                        } else {
                            request('http://omdbapi.com/?i=' + parse.Search[0].imdbID, function(error, response,body) {
                                var data = JSON.parse(body);
                                try {
                                     request(data.Poster).pipe(fs.createWriteStream(IMAGE_PATH + parsed.imdbID + '.png'));
                                    }catch(err) {
                                        console.log(err);
                                }
                                callback(null, data, loc);
                            });
                     }
                    }else {
                        callback(error);
                    }
                });
            } else {
            try {
    		       request(parsed.Poster).pipe(fs.createWriteStream(IMAGE_PATH + parsed.imdbID + '.png'));
                } catch(err) {
                    console.log(err);
            }
		        callback(null, parsed, loc);
            }
	   }
	  else {
		callback(error);
	  }
	});
};

function readDir(start, callback) {
    // Use lstat to resolve symlink if we are passed a symlink
    fs.lstat(start, function(err, stat) {
        if(err) {
            return callback(err);
        }
        var found = {dirs: [], files: [], name: []},
            total = 0,
            processed = 0;
        function isDir(abspath) {
            fs.stat(abspath, function(err, stat) {
                if(stat.isDirectory()) {
                    // If we found a directory, recurse!
                    readDir(abspath, function(err, data) {
                        found.dirs[processed] = abspath;
                        found.files[processed] = data.files;
                        if(++processed == total) { 
                            
	                         for (var i = 0; i < found.dirs.length; i++) {

	                          	found.name[i] = found.dirs[i].replace(/\.[^\.]*(?:hdtv|x264)[^\.]*/ig,"").replace(/\.[^\.]*$/,"").replace(/\./g," ").replace(/^(.*[\\\/])/, "");

	                           	imdbData(found.name[i],found.files[i], function(err, film, loc)  {
	                          		film.loc = loc;
	                           		callback(null, film);
								 });                                  
	                          }   
                        }
                    });
                } else {
                    found.files.push(abspath);
                    if(++processed == total) {
                        callback(null, found);
                    }
                }
            });
        }
        // Read through all the files in this directory
        if(stat.isDirectory()) {
            fs.readdir(start, function (err, files) {
                total = files.length;
                if(total == 0)
                {
                    callback(null, found);
                }
                else
                {
                    for(var x = 0, l = files.length; x < l; x++) {
                        isDir(path.join(start, files[x]));
                    }
                }
            });
        } else {
            return callback(new Error("path: " + start + " is not a directory"));
        }
    });
};
 
exports.readDir = readDir;
