// Some support code from MIT 6.170 Lecture 2, Fall 2014.
// The lecture doesn't aim to explain this code yet, but it may be interesting to look at, anyway.


///// Wrapping Google's Places web service
///// See API documentation here: https://developers.google.com/maps/documentation/javascript/places

var service;
// Handle to the Places service
var room_26_100 = new google.maps.LatLng(42.360502, -71.089302);
// Location on Earth of our lecture room!

// Initialize our handle to the Places service.
function initialize() {
    // The document should have a dummy <div> with ID 'map', since the API wants one.
    // It's a bit hackish, since we don't actually want to display a map.
    var map = new google.maps.Map(document.getElementById('map'));
    service = new google.maps.places.PlacesService(map);
}

// Find a list of places near 26-100 that match some search text according to Google.
// On success only, call the callback with an array of result objects, in the format
// documented for place objects in the Places API.
function nearbySearch(text, callback) {
    service.nearbySearch({location: room_26_100, radius: 1000, keyword: text},
                       function(results, status) {
                           if (status != "OK" && status != "ZERO_RESULTS") {
                               var msg = "Request to Google Places service (nearbySearch) failed (status: " + status + ")";
                               console.log(msg);
                               throw {name: "places", message: msg};
                           }

                           callback(results);
                       });
}

// Look up the full record of a given place by ID.
// On success only, call the callback with that place object.
function getDetails(placeId, callback) {
    service.getDetails({placeId: placeId},
                       function(place, status) {
                           if (status != "OK") {
                               var msg = "Request to Google Places service (getDetails) failed (status: " + status + ")";
                               console.log(msg);
                               throw {name: "places", message: msg};
                           }

                           callback(place);
                       });
}
