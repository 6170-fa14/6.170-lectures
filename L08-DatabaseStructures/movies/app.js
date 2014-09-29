var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser());

app.get('/', function (req, res) {
    res.redirect('movies');
});

// uncomment one of the following requires to select a version of the app
// movies-embed: plain Mongo API, with theater records embedded in movie records
// movies-join: plain Mongo API, relational-style schema, with theater records joined to movie records by ids
// movies-mongoose: Mongoose on top of Mongo, with relational-style schema
//var movieRoutes = require('./routes/movies-embed');
//var movieRoutes = require('./routes/movies-join');
var movieRoutes = require('./routes/movies-mongoose');
app.use('/movies', movieRoutes);

module.exports = app;