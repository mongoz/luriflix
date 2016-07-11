var api = require('moviedb')('28383d9cf5813473298453cfa26e8c77');

module.exports = {

	getMovieDetails: function(title, files, callback) {
		api.searchMovie({query: title }, function(err, res){
			if (err) {
				callback("Could not find movie: " + err);
			} else {
				if (res.results[0]) {
					api.movieInfo({id: res.results[0].id}, function(err, res){
						if (err) {
							callback("error getting info: " + err);
						} else {
							var data = res;
							console.log(data.title);
							data.files = files;
							data.media_type = "movie";
							api.movieReleases({id: data.id}, function(err, res){
								if (err) {
									callback("error getting release: " + err);
								}
								data.certification = res.countries[0].certification;
								api.movieCredits({id: data.id}, function(err, credits){
									if (err) {
										callback("error getting Credits: " +err);
									}
							   		data.actors = credits;
							   		api.movieImages({id: data.id}, function(err, images) {
							   			if(err) {
							   				callback("error getting images: " +err);
							   			}
							   			data.images = images;
								   		api.movieTrailers({id: data.id}, function(err, trailers) {
									   		if(err) {
									   			callback("error getting trailers: " +err);
									   		}
									   		data.trailers = trailers;
									   		callback(null, data);
								   		});
							   		});
							   	});
						   	});
						}
		   			});
				} else {
					console.log(title);
				}
			}
		});
	},

	getTVDetails: function(title, files, callback) {
		api.searchTv({query: title }, function(err, res){
			if (err) {
				callback("Could not find TV show: " + err);
			} else {
				if (res.results[0]) {
					api.tvInfo({id: res.results[0].id}, function(err, info) {
						if (err) {
							callback("no info found" + err);
						} else {
							var data = info;
							data.files = files;
							data.media_type = "TV";
							console.log(data.name);
							api.tvCredits({id: data.id}, function(err, credits) {
								if (err) {
									callback("error credits: " + err);
								} else {
									data.credits = credits;
									api.tvImages({id: data.id}, function(err, images) {
										if (err) {
											callback("images error: " + err);
										} else {
											data.images = images;
											api.tvContentRatings({id: data.id}, function(err, ratings) {
												if (err) {
													callback("ratings error: " + err);
												} else {
													data.contentRatings = ratings;
													var seasonInfoArr = [];

													for(var i = 1; i <= data.number_of_seasons; i++){
														(function(index) {
															api.tvSeasonInfo({id: data.id, season_number: index}, function(err, seasonInfo) {
																if(err) {
																	callback("seasonInfo: " + err);
																} else {
																	if (seasonInfo != null) {
																		seasonInfoArr.push(seasonInfo);
																	};
																	console.log("index: " + index);
																	if (index == data.number_of_seasons) {
																		console.log("done");
																		data.seasonInfo = seasonInfoArr;
																		callback(null, data);
																	};
																}
															});
														})(i);
													};
												}
											});
										}
									});
								}
							});
						}
					});
				} else {
					console.log("no results: " + title);
				}
			}
		}); 
	},

	getPersonDetails: function(id, callback) {
		var data;

		api.personInfo({id: id}, function(err, info){
			if (err) {
				callback(err);
			} else {
				data = info;
				api.personCredits({id: id}, function(err, credits){
					if (err) {
						callback(err);
					} else {
						data.credits = credits;
						api.personImages({id: id}, function(err, images){
							if (err) {
								callback(err);
							} else {
								data.images = images;
								callback(null, data);
							}
						});
					}
				});
			}
		});
	}
};

/*		api.personInfo({id: id}, function(err, info){
			if (err) {
				callback(err);
			} else {
				data = info;
				console.log(info);
			}
		}).personImages({id: id}, function(err, images){
			if (err) {
				callback(err);
			} else {
				console.log("herp: " + JSON.stringify(images, null, 4)); 
				//data.images = images;
			}
		}).personCredits({id: id}, function(err, credits){
			if (err) {
				callback(err);
			} else {
				console.log("derp" + JSON.stringify(credits, null, 4)); 
				//data.credits = credits;
				callback(null, data);
			}
		});*/


//https://image.tmdb.org/t/p/w396/


