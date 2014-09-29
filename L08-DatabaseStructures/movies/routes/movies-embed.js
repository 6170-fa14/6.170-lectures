var express = require('express');
var router = express.Router();
var Time = require('../util/time');
var data = require('../data/movie-data-embed');

// use Mongo through node-mongodb-native API, the one approved by 10gen
var MONGO_URL = '127.0.0.1:27017/movie-db';

var client = require('mongodb').MongoClient;
client.connect('mongodb://'+ MONGO_URL, function(err, db) {
  if(err) throw err;
	// setup the database by first clearing data from previous runs
	// and then popuating with fresh data
  db.dropDatabase(function (err, result) {populate(db)});
});

// populate the database with sample movie data
var populate = function (db) {
	var movies = db.collection('movies');
	movies.insert(data.movieArray, function(err, result) {
		setupRoutes(db);
	})
}

var setupRoutes = function (db) {

	// helper function that renders an array of movie objects, applying formatMovie to each
  var renderMovies = function (movieArray, res) {
		res.render('movies/index', {
			movies: movieArray.map (formatMovie)
		})    
  }

	// home page: render list of all movies
  router.get('/', function(req, res) {
  	var movies = db.collection('movies');
  	movies.find().toArray(function (err, ms) {
  	  renderMovies(ms, res)
		})
  });

	// search form submission: render list of matching movies
  router.post('/search', function(req, res) {
  	var movies = db.collection('movies');
		// construct an array with a subquery for each search field
    var query = [];
    if (req.body.title.length > 0) query.push({title: req.body.title});
    if (req.body.time.length > 0) query.push({time: Time.parse(req.body.time)});
    if (req.body.theater.length > 0) query.push({'theater.name': req.body.theater});
		// if button is pressed and all fields are empty, just redisplay form
		// else query database using conjunction of subqueries and render results
    if (query.length == 0)
      res.redirect('/movies/find');
    else
    	movies.find({$and: query}).toArray(function (err, ms) {
    	  renderMovies(ms, res)
  		})
  });

	// search page: render form
  router.get('/find', function(req, res) {
  	res.render('movies/find');
  });
}

// transform stored form of movie to display form
var formatMovie = function (m) {
  return {
    title: m.title,
    theater: m.theater.name + ", " + m.theater.location,
    time: Time.unparse(m.time)
    };
}

module.exports = router;