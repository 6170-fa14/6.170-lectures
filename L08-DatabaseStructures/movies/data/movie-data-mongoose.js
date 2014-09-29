var Time = require('../util/time');
var mongoose = require('mongoose');

// declare schema for database
// relational-style representation of movie database
// separate "tables" for movies and theaters, with theaters linked by ids
// this requires forming "joins" when queries are made

var theaterSchema = mongoose.Schema({
    _id: Number,
    name: String,
    location: String
});

var movieSchema = mongoose.Schema({
    title: String,
    time: Number,
    theater: {type: Number, ref: 'Theater'}
});

exports.Theater = mongoose.model('Theater', theaterSchema);
exports.Movie = mongoose.model('Movie', movieSchema);

exports.theaterArray = [
  {_id: 1, name: "Legacy Place", location: "Dedham"},
	{_id: 2, name: "West Newton Cinema", location: "Newton"},
	{_id: 3, name: "Fenway Stadium", location: "Boston"}
	];

exports.movieArray = [
	{
		title: "Fury",
		time: Time.parse("7:00pm"),
		theater: 2
	}, {
		title: "Lucy",
		time: Time.parse("8:30pm"),
		theater: 2
	}, {
		title: "Boyhood",
		time: Time.parse("9:00pm"),
		theater: 2
	}, {
		title: "Chef",
		time: Time.parse("10:00pm"),
		theater: 2
	}, {
		title: "Lucy",
		time: Time.parse("7:00pm"),
		theater: 1
	}, {
		title: "Boyhood",
		time: Time.parse("7:00pm"),
		theater: 1
	}, {
		title: "Fury",
		time: Time.parse("9:00pm"),
		theater: 1
	}, {
		title: "Chef",
		time: Time.parse("9:00pm"),
		theater: 1
	}, {
		title: "Boyhood",
		time: Time.parse("9:00pm"),
		theater: 1
	}, {
		title: "Chef",
		time: Time.parse("7:00pm"),
		theater: 3
	}, {
		title: "Divergent",
		time: Time.parse("9:00pm"),
		theater: 3
	}, {
		title: "Neighbors",
		time: Time.parse("9:00pm"),
		theater: 3
	}, {
		title: "Maleficent",
		time: Time.parse("9:00pm"),
		theater: 3
	}];
