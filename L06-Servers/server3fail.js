var net = require('net');
const successProb = 0.7 // fraction of attempts that succeed

randomFail = function () {if (Math.random() > successProb) undefined.x;}

var server = net.createServer(function (socket) {
    socket.write('Ready\r\n');
    socket.on('data', function(chunk) {
	randomFail();
	socket.write('Hello world ' + chunk);
    });
});

server.listen(1337, '127.0.0.1');
