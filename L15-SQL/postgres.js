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
            db.query('BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE',
                     function() {
                         db.query("SELECT NEXTVAL('messageIds') AS id",
                                  function(err, id) {
                                      id = id.rows[0].id;

                                      db.query('INSERT INTO messages(id, usr, text) VALUES ($1, $2, $3)',
                                               [id, user, req.body.text],
                                               function() {
                                                   var hashTags = req.body.text.match(/#\w+/g);

                                                   function insertTags(i) {
                                                       if (!hashTags || i >= hashTags.length) {
                                                           db.query('COMMIT',
                                                                    function () {
                                                                        done();
                                                                        res.redirect('/');
                                                                    });
                                                       } else {
                                                           db.query('INSERT INTO hashtags(tag, message) VALUES ($1, $2)',
                                                                    [hashTags[i], id],
                                                                    function() {
                                                                        insertTags(i+1);
                                                                    });
                                                       }
                                                   }

                                                   insertTags(0);
                                               });
                                  });
                     });
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

app.get('/hashtag', function (req, res) {
    var user = req.cookies.user;

    if (user) {
        pg.connect(connection_string, function(err, db, done) {
            db.query('SELECT usr, text FROM messages, followers, hashtags WHERE tag = $1 AND follower = $2 AND id = message AND usr = followed', [req.param('tag'), user],
                     function(err, messages) {
                         res.render('fritter', {user: null,
                                                messages: messages.rows});
                         done();
                     });
        });
    }
});

app.listen(8080);
