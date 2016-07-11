var request = require('request'),
	fs = require('fs'),
	path = require('path'),
    s = require('./sort');

var IMAGE_PATH = './public/pics/';

function downloadImage(data) {
    try {
        request(data.Poster).pipe(fs.createWriteStream(IMAGE_PATH + data.imdbID + '.png'));
        } catch(err) {
        console.log(err + " " + data.Title);
    }
};

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
                                downloadImage(data);
                                data.loc = loc;
                                callback(null, data);
                            });
                     }
                    }else {
                        callback(error);
                    }
                });
            } else {
                downloadImage(parsed);
                parsed.loc = loc;
		        callback(null, parsed);
            }
	    } else {
		callback(error);
	  }
	});
};


function getByTitle(film, files, callback) {
    request('http://omdbapi.com/?t=' + film, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var parsed = JSON.parse(body);

            if(parsed.Error) {
                getBySearch(film, files, function(err, data) {
                    callback(null, data);
                });
            } else {
                if(parsed.Type == "series") {
                    getEpisodes(parsed, function(err, data) {
                        parsed.Episodes = data;
                        downloadImage(parsed);
                        parsed.files = files;
                        callback(null, parsed);
                    });
                } else {
                    downloadImage(parsed);
                    parsed.files = files;
                    callback(null, parsed);
                }
            }
        } else {
            callback(error);
        }
    });
};

function getBySearch(film, files, callback) {
    request('http://omdbapi.com/?s=' + film, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            var parse = JSON.parse(body);             
            if (parse.Error) {
                console.log("error:" + film + ": " + parse.Error);
            } else {
                request('http://omdbapi.com/?i=' + parse.Search[0].imdbID, function(error, response,body) {
                    var data = JSON.parse(body);
                    downloadImage(data);
                    data.files = files;
                    callback(null, data);
                });
            }
        } else {
            callback(error);
        } 
    });
};

function getEpisodes(series, callback) {
   // console.log(series.Title);
    request('http://imdbapi.poromenos.org/js/?name=' + series.Title + "&year=" + series.Year, function (error, response, body) {
    var Title = Object.keys(data);
        data[Title].episodes.sort(s.dynamicSortMultiple("season", "number"));

        var season = 0;
        var Episodes = new Array(new Array());

        data[Title].episodes.forEach(function(episodes) {
             if(season < episodes.season) {
                 season++;
                 Episodes[season] = new Array();
             }
            Episodes[season][episodes.number] = episodes.name;
        });

        callback(null, Episodes);
    });
};

exports.getEpisodes = getEpisodes;
exports.getByTitle = getByTitle;
exports.imdbData = imdbData;
exports.downloadImage = downloadImage;
