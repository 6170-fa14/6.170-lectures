var net = require('net');
const successProb = 0.7 // fraction of attempts that succeed

randomFail = function () {if (Math.random() > successProb) {while (true) {}};}

var server = net.createServer(function (socket) {
    socket.write('Ready\r\n');
    socket.on('data', function(chunk) {
	try {
	randomFail();
	socket.write('Hello world ' + chunk);
	} catch (er) {
	    console.log("Failed: " + er.message);
	}
    });
});

server.listen(1337, '127.0.0.1');
