const mbtaBase =  'http://realtime.mbta.com/developer/api/v2/';
const mbtaKey = '?api_key=';
const mbtaFormat = '&format=json';
const publicKey = 'wX9NwuHnZU2ToO7GmGR9uw';
const myKey = '';

var map;

const mbtaQuery = function (query) {
    var mbtaUrl = mbtaBase + query + mbtaKey + publicKey + mbtaFormat;
    return mbtaUrl;
}
 
function handler(result) {
    console.log(result);
}

const getRoutes = function (f) {
    $.getJSON(mbtaQuery("routes"), f);
};

window.onload = function () {
    getRoutes(handler);
};
