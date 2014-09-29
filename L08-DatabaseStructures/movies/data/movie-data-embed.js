var Time = require('../util/time');

// simplest representation of movie database
// theater record is embedded in movie record

exports.movieArray = [
{
		title: "Fury",
		time: Time.parse("7:00pm"),
		theater: {name: "West Newton Cinema", location: "Newton"}
	}, {
		title: "Lucy",
		time: Time.parse("8:30pm"),
		theater: {name: "West Newton Cinema", location: "Newton"}
	}, {
		title: "Boyhood",
		time: Time.parse("9:00pm"),
		theater: {name: "West Newton Cinema", location: "Newton"}
	}, {
		title: "Chef",
		time: Time.parse("10:00pm"),
		theater: {name: "West Newton Cinema", location: "Newton"}
	}, {
		title: "Lucy",
		time: Time.parse("7:00pm"),
		theater: {name: "Legacy Place", location: "Dedham"}
	}, {
		title: "Boyhood",
		time: Time.parse("7:00pm"),
		theater: {name: "Legacy Place", location: "Dedham"}
	}, {
		title: "Fury",
		time: Time.parse("9:00pm"),
		theater: {name: "Legacy Place", location: "Dedham"}
	}, {
		title: "Chef",
		time: Time.parse("9:00pm"),
		theater: {name: "Legacy Place", location: "Dedham"}
	}, {
		title: "Boyhood",
		time: Time.parse("9:00pm"),
		theater: {name: "Legacy Place", location: "Dedham"}
	}, {
		title: "Chef",
		time: Time.parse("7:00pm"),
		theater: {name: "Fenway Stadium 13", location: "Boston"}
	}, {
		title: "Divergent",
		time: Time.parse("9:00pm"),
		theater: {name: "Fenway Stadium 13", location: "Boston"}
	}, {
		title: "Neighbors",
		time: Time.parse("9:00pm"),
		theater: {name: "Fenway Stadium 13", location: "Boston"}
	}, {
		title: "Maleficent",
		time: Time.parse("9:00pm"),
		theater: {name: "Fenway Stadium 13", location: "Boston"}		
}
];
