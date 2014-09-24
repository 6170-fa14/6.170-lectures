var net = require('net');

var server = net.createServer(function (socket) {
    socket.write('Ready\r\n');
    socket.on('data', function(chunk) {
	socket.write('Hello world ' + chunk);
    });
});

server.listen(1337, '127.0.0.1');
