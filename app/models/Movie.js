var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var MovieSchema = new Schema({
 	title: { type: String, required: true, trim: true },
  year: Number,
  runtime: Number,
  released: String,
  genre: Array,
  actors: Array,
  plot: String,
  poster: String,
  backdrop: String,
  rating: String,
  language: Array,
  tmdbID: Number,
  imdbID: String,
  type: String,
  certification: String,
  budget: Number,
  images: Array,
  trailer: Array,
  created_at: Date,
  updated_at: Date,
  files: Array
});

// on every save, add the date
MovieSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

// the schema is useless so far
// we need to create a model using it
var Movie = mongoose.model('Movie', MovieSchema);

// make this available to our users in our Node applications
module.exports = Movie;
