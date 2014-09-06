// An example using Google's Places web service

var service, room_26_100;

function initialize() {
    room_26_100 = new google.maps.LatLng(42.360502, -71.089302);
    var map = new google.maps.Map(document.getElementById('map'));
    service = new google.maps.places.PlacesService(map);
}

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
