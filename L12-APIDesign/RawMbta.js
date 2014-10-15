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

function reqListener () {
    console.log(this.readyState);
    console.log(this.responseText);
}

const getRoutes = function () {
    var result; 
    req.onreadystatechange = reqListener;
    req.open("get", mbtaQuery("routes"));
    console.log("opened request");
    req.send();
    console.log("sent request");
}

window.onload = function () {
    getRoutes();
};
