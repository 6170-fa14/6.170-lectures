var express = require('express');

var app = express();

var doHelloWorld = function (req, res) {
    console.log(req.method);
    res.send('Hello World\n');
}

var defaultAction = doHelloWorld;

app.get('/', function(req, res){
  doHelloWorld(req, res);
});

app.put('/', function(req, res){
  doHelloWorld(req, res);
});

app.post('/', function(req, res){
    doHelloWorld(req,res);
});

app.delete('/', function(req, res){
    doHelloWorld(req,res);
});

app.listen(1337);

console.log('Server running at http://127.0.0.1:1337/');
