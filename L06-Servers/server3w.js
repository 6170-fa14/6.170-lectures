var http = require('http');
var net = require('net');

packageReply = function(res, text) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(text);
}

http.createServer(function (req, res) {
    var conn = net.createConnection(1337);
    console.log("opened connection");
    var text = "";  // initially nothing from telnet server
    conn.write("\r\n"); // send CRLF
    // assemble reply
    conn.on('data', function(chunk) {
	text += chunk;
	console.log("data");
    });
    // have full reply
    conn.on('end', function() {
	console.log("end");
	packageReply(res, text)
    });
    conn.end();
    console.log("closed connection");
}).listen(1338, '127.0.0.1');



console.log('Server running at http://127.0.0.1:1338/');
