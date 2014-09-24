var http = require('http');

var prefixes = ['Hello world'];

var singleTextResult = function (req, res, text) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(text + '\n'); 
}

var cantDo = function (req, res) {
    res.writeHead(405, {'Content-Type': 'text/plain'});
    res.end("Can't do " + req.method + '\n');
}

var defaultAction = cantDo;

var doGet = defaultAction;
var doPut = defaultAction;
var doPost = defaultAction;
var doDelete = defaultAction;

doGet = function (req, res) {
    singleTextResult(prefixes.length);
}

doPost = function (req, res) {
    if (req.url.indexOf('add') === 0) {
	doAdd (req, res);
    } else if (req.url.indexOf('replace') === 0 {
	doReplace (req, res);
    } else if (req.url.indexOf('reset') === 0 {
	doReset (req, res);
    }
	      else {
		  singleTextResult
    }
}

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
