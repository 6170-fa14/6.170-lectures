var net = require('net');

const cmdGoodbye = '/goodbye';
const cmdReplace = '/replace';  // '/replace x' makes x prefix

var server = net.createServer(function (socket) {
    var prefix = 'Hello world';
    socket.setEncoding('utf8');
    socket.write('Ready\r\n');
    socket.on('data', function(chunk) {
	if (chunk.indexOf(cmdGoodbye) === 0) {
	    socket.end("Finished", 'utf8');
	} else if (chunk.indexOf(cmdReplace) === 0) {
	    var rest = chunk.substr(cmdReplace.length + 1); // skip blank
	    rest = rest.substr(0,rest.length - 2); // remove \r\n
	    console.log("New prefix: " + rest);
	    prefix = rest;
	} else {	    
	    socket.write(prefix + ' ' + chunk);
	}
    });
});

server.listen(1337, '127.0.0.1');
