var Time = require('../util/time');

// relational-style representation of movie database
// separate "tables" for movies and theaters, with theaters linked by ids
// this requires forming "joins" when queries are made

exports.theaterArray = [
  {id: 1, name: "Legacy Place", location: "Dedham"},
	{id: 2, name: "West Newton Cinema", location: "Newton"},
	{id: 3, name: "Fenway Stadium 13", location: "Boston"}
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
