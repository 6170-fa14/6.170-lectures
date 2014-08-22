// Import the Web-serving module.
var http = require("http");

// Function called on every HTTP request
function handle(request, response) {
    if (request.url == '/') {
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write('<!DOCTYPE html>'
                       + '<html>'
                       + '<head>'
                       + '<meta charset="UTF-8">'
                       + '</head>'
                       + '<body>'
                       + '<a href="/otherPage">Go to the other page.</a>'
                       + '</body>'
                       + '</html>');
        response.end();
    } else if (request.url == '/otherPage') {
        // First, tell the client that we will be sending HTML.
        response.writeHead(200, {"Content-Type": "text/html"});

        // Next, write the HTML document.
        response.write('<!DOCTYPE html>'
                       + '<html>'
                       + '<head>'
                       + '<title>Hello, 6.170 World!</title>'
                       + '<meta charset="UTF-8">'
                       + '<script type="text/javascript">'
                       + 'var counter = 0;'
                       + 'function changeit() {'
                       + 'var text = document.getElementById("text");'
                       + 'var changeto = document.getElementById("changeto");'
                       + 'text.innerHTML = "#" + counter + ": " + changeto.value;'
                       + 'counter++;'
                       + '}'
                       + '</script>'
                       + '</head>'
                       + '<body>'
                       + '<h1>Hello, <a href="https://stellar.mit.edu/S/course/6/fa14/6.170/">6.170</a> World!</h1>'
                       + '<button onclick="changeit()">Set text to:</button> <input type="text" id="changeto">'
                       + '<p id="text">I\'m <i>waiting</i>!</p>'
                       + '</body>'
                       + '</html>');

        // Indicate that the response is fully determined now.
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
