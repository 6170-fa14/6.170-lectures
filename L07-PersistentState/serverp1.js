var net = require('net');
var MongoClient = require('mongodb').MongoClient;

const cmdGoodbye = '/goodbye';
const cmdReplace = '/replace';  // '/replace x' makes x prefix

var storePrefix_ = function(prefix, coll) {
    coll.insert({prefix:prefix}, function(err, subs) {
		    if(err) throw err;
		    console.log("Inserted:" + prefix);
    });
}

var makePrefixStorer = function(coll) {
    return function (prefix) {
	storePrefix_(prefix, coll);
	};
}

var server = net.createServer(function (socket) {
    var prefix;
    var prefixStorer;
    socket.setEncoding('utf8');
    socket.write('Ready\r\n');
 
    // set up database
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
	if(err) throw err;

	var collection = db.collection('substitutions');
	prefixStorer = makePrefixStorer(collection);
	collection.find().toArray(function(err, results) {
	    console.dir(results);
	    if (results.length === 0) {
		// initialize
		prefix = "Hello world";
		prefixStorer(prefix);
	    } else {
		prefix = results[0];  // just take first if multiple members
	    }
	});
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
	} else {	    
	    socket.write(prefix + ' ' + chunk);
	}
    });
});

server.listen(1337, '127.0.0.1');
