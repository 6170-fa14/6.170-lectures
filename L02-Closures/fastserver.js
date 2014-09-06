// Import the Web-serving module.
var http = require("http");

// A module to do serving of static files for us.
// We need to serve the static HTML on the same host & port as this server, to satisfy browsers' security rules!
var serveStatic = require("serve-static");

var serve = serveStatic(".");

// Function called on every HTTP request, doing something pretty dumb here.
function handle(request, response) {
    if (request.url.indexOf('/?') == 0) {
        window.setTimeout(function() {
        // This is our fake query handlers.
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write("Hello " + unescape(request.url.substring(2)));
            response.end(); }, 10000);
    } else {
        serve(request, response);
    }
}

// Create a new Web server that calls 'handle' on every request.
var server = http.createServer(handle);
// Start that server listening on TCP port 8080.
server.listen(8080);
