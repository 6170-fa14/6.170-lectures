var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser());

var monk = require('monk');
var connection_string = 'localhost/fritter';

var db = monk(connection_string);

app.get('/', function (req, res) {
    db.get('messages').find({}, function(e, docs) {
        res.render('fritter', {user: req.cookies.user, messages: docs});
    });
});

app.post('/login', function (req, res) {
    res.cookie('user', req.body.user);
    res.redirect('/');
});

app.post('/logout', function (req, res) {
    res.clearCookie('user');
    res.redirect('/');
});

app.post('/send', function (req, res) {
    var user = req.cookies.user;

    if (user) {
        db.get('messages').insert({user: user, text: req.body.text},
                                  function() { res.redirect('/'); });
    }
});

app.listen(8080);
