var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var TVSchema = new Schema({
 	title: { type: String, required: true, trim: true },
  runtime: Array,
  released: String,
  genre: Array,
  created_by: Array,
  status: String,
  networks: Array,
  actors: Array,
  plot: String,
  poster: String,
  backdrop: String,
  rating: String,
  language: String,
  tmdbID: Number,
  type: String,
  certification: String,
  images: Array,
  number_of_episodes: Number,
  number_of_seasons: Number,
  seasons: Array,
  seasonInfo: Array,
  created_at: Date,
  updated_at: Date,
  files: Array
});

// on every save, add the date
TVSchema.pre('save', function(next) {
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
var TV = mongoose.model('TV', TVSchema);

// make this available to our users in our Node applications
module.exports = TV;