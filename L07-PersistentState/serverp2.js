var net = require('net');
var MongoClient = require('mongodb').MongoClient;

const cmdGoodbye = '/goodbye';
const cmdReplace = '/replace';  // '/replace x' makes x prefix
const cmdReset = '/reset';
const defaultPrefix = 'Hello world';

var PrefixStorer = function(coll) {

    var store_ = function(prefix, c) {
	c.insert({prefix:prefix}, function(err, subs) {
	    if(err) throw err;
	    console.log("Inserted:" + prefix);
	});
    }

    return function (prefix) {
	store_(prefix, coll);
    };
}

var PrefixReset = function(coll) {

    var reset_ = function(c) {
	c.remove({}, {}, function(err, numberOfRemovedDocs) {
            if (err) throw err;
            console.log("Removed " + numberOfRemovedDocs + " elements");
	});
    }

    return function () {
	reset_(coll);
    };
}


var server = net.createServer(function (socket) {
    socket.setEncoding('utf8');
    socket.write('Ready\r\n');
    
    // set up database
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
	if(err) throw err;
	var prefix;
	var collection = db.collection('substitutions');
	var prefixStorer = PrefixStorer(collection);
	var prefixReset = PrefixReset(collection);
	collection.find().toArray(function(err, results) {
	    console.dir(results);
	    if (results.length === 0) {
		// initialize
		prefix = defaultPrefix;
		prefixStorer(prefix);
	    } else {
		prefix = results[0].prefix;  // just take first if multiple members
		console.log("Retrieved prefix: " + prefix);
	    }
	});
	
	// process input
	socket.on('data', function(chunk) {
	    if (chunk.indexOf(cmdGoodbye) === 0) {
		db.close();
		socket.end("Finished", 'utf8');
	    } else if (chunk.indexOf(cmdReplace) === 0) {
		var rest = chunk.substr(cmdReplace.length + 1); // skip blank
		rest = rest.substr(0,rest.length - 2); // remove \r\n
		console.log(rest);
		prefix = rest;
		prefixStorer(prefix);
	    } else if (chunk.indexOf(cmdReset) === 0) {
		prefixReset(); // remove all elements
		prefix = defaultPrefix;  // not really the right solution...
	    } else {	    
		socket.write(prefix + ' ' + chunk);
	    }
	});

    });  // end MongoClient.connect
    
}); // end net.createServer

server.listen(1337, '127.0.0.1');
