var http = require('http');

var doHelloWorld = function (req, res) {
    console.log(req.method);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}

var defaultAction = doHelloWorld;

var doGet = defaultAction,
    doPut = defaultAction,
    doPost = defaultAction,
    doDelete = defaultAction;

http.createServer(function (req, res) {
    var url, meth;
    try {
	url = req.url;
	meth = req.method;
	switch (meth) {
	case 'GET': {
	    doGet(req, res);
	    break;
	}
	case 'PUT': {
	    doPut(req, res);
	    break;
	}
	case 'POST': {
	    doPost(req, res);
	    break;
	}
	case 'DELETE': {
	    doDelete(req, res);
	    break;
	}
	default: {
	    console.log("Unexpected method"); // replace with throw
	    break;
	} 
	}
    } catch (er) {
	// something went wrong
	res.writeHead(500, {'Content-Type': 'text/plain'});
	res.end('Internal server error\n');
    }
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
