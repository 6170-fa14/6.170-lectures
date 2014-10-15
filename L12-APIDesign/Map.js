const mapApiKey = 'AIzaSyCi_E2MuLj0e7DYpiLgpb-sNv7-EIUQOVc';
const mapApiBase = 'https://www.google.com/maps/embed/v1/';
const mapQuery = 'Red Line stations'
const realMapQuery = encodeURIComponent(mapQuery);

window.onload = function () {
    $("#map").attr("src", mapApiBase + "search?key=" + mapApiKey + "&q=" + realMapQuery);    
};

