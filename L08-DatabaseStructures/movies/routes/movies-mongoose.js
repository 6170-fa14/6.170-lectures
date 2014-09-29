var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var Time = require('../util/time');
var data = require('../data/movie-data-mongoose');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongoose-movie-db');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongoose connection error:'));
db.once('open', function callback () {
  mongoose.connection.db.dropDatabase(
    function (err, result) {insertMovies(db)}
  );
});

var insertMovies = function (db) {
  var inserted = 0;
  data.movieArray.forEach(function (movie) {
    var m = new data.Movie(movie);
    m.save(function (err) {
      // assume no errors
      inserted++;
      if (inserted == data.movieArray.length)
        insertTheaters(db);      
    });
  });
}

var insertTheaters = function (db) {
  var inserted = 0;
  data.theaterArray.forEach(function (theater) {
    var t = new data.Theater(theater);
    t.save(function (err) {
      // assume no errors
      inserted++;
      if (inserted == data.theaterArray.length)
        setupRoutes(db);      
    });
  });
}

var setupRoutes = function (db) {
	// render using response res the results of querying the database with a conjunction
	// of the queries in the array query
	// note use of Mongoose populate here: critical to making the join easy
	// also illustrates use of sort
  var renderQuery = function (query, res) {
    data.Movie.find({$and: query}).sort({time: 'asc'}).exec(function (err, movies) {
      data.Movie.populate(movies, {path: "theater"}, function (err, result) {
        res.render('movies/index', {movies: movies.map(formatMovie)})
      })
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

var formatMovie = function (m) {
  return {
    title: m.title,
    theater: m.theater.name + ", " + m.theater.location,
    time: Time.unparse(m.time)
    };
}

module.exports = router;