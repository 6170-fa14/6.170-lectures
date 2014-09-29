var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var Time = require('../util/time');
var data = require('../data/movie-data-join');

// use Mongo through node-mongodb-native API, the one approved by 10gen
// mongojs allows slightly more natural code since db doesn't have to be passed to callback
var MONGO_URL = '127.0.0.1:27017/movie-db';

var client = require('mongodb').MongoClient;
client.connect('mongodb://'+ MONGO_URL, function(err, db) {
  if(err) throw err;
  db.dropDatabase(function (err, result) {populate(db)});
});

var populate = function (db) {
	var movies = db.collection('movies');
	var theaters = db.collection('theaters');
	theaters.insert(data.theaterArray, function(err, result) {
	  movies.insert(data.movieArray, function(err, result) {
	    setupRoutes(db);
    });
  });
}

var setupRoutes = function (db) {

  // render using response object res the results of querying the database with a conjunction
  // of the queries in the array query
  var renderQuery = function (query, res) {
  	var movies = db.collection('movies');
  	var theaters = db.collection('theaters');
    var listings = [];
		// note that this is really quite painful: performing joins in plain Mongo is not easy!
		// hard to avoid toArray; need to know how many results in order to detect last callback
		// note that result is not sorted! puzzle: would adding .sort({time: 1}) help?
    movies.find({$and: query}).toArray(function (err, ms) {
      ms.forEach(function (movie, index) {
        theaters.findOne({id: movie.theater}, function (err, theater) {
        listings.push({title: movie.title, theater: theater.name + ", " + theater.location, time: Time.unparse(movie.time)});
        if (listings.length === ms.length)
          res.render('movies/index', {movies: listings});
        });
      });
    });
  }
  
	// home page: render list of all movies
  router.get('/', function(req, res) {
    renderQuery([{}], res);
  })

	// search form submission: render list of matching movies
  router.post('/search', function(req, res) {
    var theaters = db.collection('theaters');
    var query = [];
    if (req.body.title.length > 0)
      query.push({title: req.body.title});
    if (req.body.time.length > 0)
      // note: no error handling here; will throw exception if time field misformed
      query.push({time: Time.parse(req.body.time)});
    if (req.body.theater.length > 0)
      theaters.findOne({name: req.body.theater}, function (err, theater) {
        query.push({theater: theater.id});
        renderQuery(query, res);
      });
    else if (query.length === 0)
      res.redirect('/movies/find');
    else
      renderQuery(query, res);
  });

	// search page: render form
  router.get('/find', function(req, res) {
  	res.render('movies/find');
  });
}

module.exports = router;