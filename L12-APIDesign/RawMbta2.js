const mbtaBase =  'http://realtime.mbta.com/developer/api/v2/';
const mbtaKey = '?api_key=';
const mbtaFormat = '&format=json';
const publicKey = 'wX9NwuHnZU2ToO7GmGR9uw';
const myKey = '';
const DONE = 4;  // XMLHttpRequest constant

var map;

const mbtaQuery = function (query) {
    var mbtaUrl = mbtaBase + query + mbtaKey + publicKey + mbtaFormat;
    return mbtaUrl;
}

var req = new XMLHttpRequest();
 
function reqListener() {
     if (this.readyState === DONE) {
	if (this.responseType === "json") {
	    var result = this.response;
	    console.log(result);
	} else {
	    console.log("Unexpected response type: " + this.responseType);
	}		
     } // else ignore
}

const getRoutes = function () {
    var result; 
    req.onreadystatechange = reqListener;
    req.open("get", mbtaQuery("routes"));
    req.responseType = "json";
    console.log("opened request");
    req.send();
    console.log("sent request");
};

window.onload = function () {
    getRoutes();
};
