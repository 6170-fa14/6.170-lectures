const mbtaBase =  'http://realtime.mbta.com/developer/api/v2/';
const mbtaKey = '?api_key=';
const mbtaFormat = '&format=json';
const publicKey = 'wX9NwuHnZU2ToO7GmGR9uw';
const myKey = '';

var map;

function initialize() {
    var mapOptions = {
	center: { lat: 42.320685, lng: -71.052391},  // centered on JFK / UMass
	zoom: 11
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
			      mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);


const mbtaQuery = function (query) {
    var mbtaUrl = mbtaBase + query + mbtaKey + publicKey + mbtaFormat;
    return mbtaUrl;
}

const mbtaQueryParam = function (query, params) {
    var qstring = '';
    for (var key in params) {
	qstring += ('&' + key + '=' + params[key]);
    }
    var mbtaUrl = mbtaBase + query + mbtaKey + publicKey + qstring + mbtaFormat;
    return mbtaUrl;
}

const getRedLineRoutes = function () {
    var ids = []; // will contain Red Line route ids
    $.getJSON(mbtaQuery("routes"), function(result){
	var mode = result.mode;
	for (var i=0; i<mode.length; i++) {
	    var elt = mode[i];
	    // console.log(i);
	    if (elt.mode_name === "Subway") {
		var routes = elt.route;
		for (var j=0; j<routes.length; j++) {
		    var r = routes[j];
		    var rn = r.route_name;
		    switch (rn) {
		    case "Red Line": 
			ids.push(r.route_id);
			// console.log("Red Line:" + r.route_id);
			break;
		    case "Mattapan Trolley": // also part of Red Line
			ids.push(r.route_id);
			// console.log("Trolley:" + r.route_id);
			break;
		    default: 
			// do nothing 
			break;
		    }	
		}
		// console.log(r.route_id + ':' + r.route_name);
	    } else {
		// console.log("Non subway");
	    }
	}
	getStations(ids);
    });
} 

const getStations = function(routes) {
    var stations = {};
    for (var j=0; j<routes.length; j++) {
	var r = routes[j];
	$.getJSON(
	    mbtaQueryParam("stopsbyroute", {route:r}), 
	    function(result) {
		var stops = result.direction[0].stop;
		for (var i=0; i<stops.length; i++) {
		    var s = stops[i];
		    stations[s.parent_station_name] = {lat: s.stop_lat,
						       lon: s.stop_lon};
		    // console.log(s.parent_station_name + ": " + 
		    //	    s.stop_lat + ", " + s.stop_lon);
		}
		if (j === (routes.length-1)) { // last iteration
		    return stations;  
		}
		placeMarkers(stations);
	    });
    }
    //console.log(stations);
}

const placeMarkers = function(stations) {
    var markers = [];
    const iconspec = {path:google.maps.SymbolPath.CIRCLE,
		      strokeColor: "red",
		      scale:3};
    for (s in stations) {
	// console.log(s + "::" + stations[s].lat + ", " + stations[s].lon);
	var latlng = new google.maps.LatLng(stations[s].lat,stations[s].lon);
	markers.push(new google.maps.Marker({position:latlng,
					     map:map,
					     title:s,
					     icon:iconspec
					    }));
    }
}

window.onload = function () {
    getRedLineRoutes(getStations);
};
