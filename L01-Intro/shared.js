// Import the Web-serving module.
var http = require("http");

// All clients share a scratch space for text.  Store it in this global variable.
var scratch = "";

// Function called on every HTTP request
function handle(request, response) {
    console.log("Request for URL: " + request.url);

    // Do different things based on which URL the browser asked for.
    if (request.url == '/') {
        // First, tell the client that we will be sending HTML.
        response.writeHead(200, {"Content-Type": "text/html"});

        // Next, write the HTML document.
        response.write('<!DOCTYPE html>'
                       + '<html>'
                       + '<head>'
                       + '<title>Hello, 6.170 World!</title>'
                       + '<meta charset="UTF-8">'
                       + '<script type="text/javascript">'
                       + 'function changeit() {'
                       + 'var text = document.getElementById("text");'
                       + 'var changeto = document.getElementById("changeto");'
                       + 'text.innerHTML = changeto.value;'
                       + 'var xhr = new XMLHttpRequest();'
                       + 'xhr.open("GET", "/change/" + escape(changeto.value), false);'
                       + 'xhr.send();'
                       + '}'
                       + 'function refresh() {'
                       + 'var text = document.getElementById("text");'
                       + 'var xhr = new XMLHttpRequest();'
                       + 'xhr.open("GET", "/latest", false);'
                       + 'xhr.send();'
                       + 'text.innerHTML = xhr.responseText;'
                       + '}'
                       + '</script>'
                       + '</head>'
                       + '<body>'
                       + '<h1>Multiplayer Text Saving</h1>'
                       + '<button onclick="changeit()">Set text to:</button> <input type="text" id="changeto">'
                       + '<p id="text">' + scratch + '</p>'
                       + '<button onclick="refresh()">Update from server</button>'
                       + '</body>'
                       + '</html>');

        // Indicate that the response is fully determined now.
        response.end();
    } else if (request.url.indexOf('/change/') == 0) {
        // In other words, the request URL begins with '/change/'!

        // Parse out the new text as the rest of the URL.
        var newText = request.url.substring(8);
        // Convert back from HTTP escaped format.
        newText = unescape(newText);

        // Overwrite scratch space.
        scratch = newText;

        // Send a dummy OK response.
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.end();
    } else if (request.url == '/latest') {
        // Send latest scratch text to browser.
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write(scratch);
        response.end();
    } else {
        // Page not found!  Better inform the client of the error.
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write('Unknown page');
        response.end();
    }
}

// Create a new Web server that calls 'handle' on every request.
var server = http.createServer(handle);
// Start that server listening on TCP port 8080.
server.listen(8080);
