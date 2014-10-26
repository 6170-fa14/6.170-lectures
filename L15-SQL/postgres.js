var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser());

var pg = require('pg');
var connection_string = 'postgres://fritter:fritter@localhost/fritter';

app.get('/', function (req, res) {
    var user = req.cookies.user;

    pg.connect(connection_string, function(err, db, done) {
        if (user) {
            db.query('SELECT followed FROM followers WHERE follower = $1', [user],
                     function(err, following) {
                     db.query('SELECT usr, text FROM messages, followers WHERE usr = followed AND follower = $1',
                              [user],
                              function(err, messages) {
                                  res.render('fritter', {user: user,
                                                         messages: messages.rows,
                                                         following: following.rows});
                                  done();
                              });
                     });
        } else {
            db.query('SELECT text FROM messages, followers',
                     function(err, messages) {
                         res.render('fritter', {user: user,
                                                messages: messages.rows});
                         done();
                     });
        }
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
        pg.connect(connection_string, function(err, db, done) {
            db.query('INSERT INTO messages(usr, text) VALUES ($1, $2)',
                     [user, req.body.text],
                     function(err) {
                         if (err) { console.log(err); }
                         done();
                         res.redirect('/');
                     })
        });
    }
});

app.post('/follow', function (req, res) {
    var user = req.cookies.user;

    if (user) {
        pg.connect(connection_string, function(err, db, done) {
            db.query('INSERT INTO followers(follower, followed) VALUES ($1, $2)',
                     [user, req.body.user],
                     function() {
                         done();
                         res.redirect('/');
                     })
        });
    }
});

app.post('/unfollow', function (req, res) {
    var user = req.cookies.user;

    if (user) {
        pg.connect(connection_string, function(err, db, done) {
            db.query('DELETE FROM followers WHERE follower = $1 AND followed = $2',
                     [user, req.body.user],
                     function() {
                         done();
                         res.redirect('/');
                     })
        });
    }
});

app.listen(8080);
