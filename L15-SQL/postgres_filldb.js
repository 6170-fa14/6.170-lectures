var pg = require('pg');
var connection_string = 'postgres://fritter:fritter@localhost/fritter';

var db = new pg.Client(connection_string);

var num_users = 1000;
var each_follows = 20;
var each_messages = 10;

pg.connect(connection_string, function(err, db, done) {
    function followersForUser(user, count, callback) {
        if (count >= each_follows) {
            callback();
        } else {
            var follow = Math.floor(Math.random() * 1000);
            db.query('INSERT INTO followers(follower, followed) VALUES ($1, $2)',
                     ["user" + user, "user" + follow],
                     function() { followersForUser(user, count+1, callback); });
        }
    }

    function createFollowers(user, callback) {
        if (user >= num_users) {
            callback();
        } else {
            followersForUser(user, 0, function() { createFollowers(user+1, callback); })
        }
    }

    function messagesForUser(user, count, callback) {
        if (count >= each_messages) {
            callback();
        } else {
            var message = Math.random() + "!";
            db.query('INSERT INTO messages(usr, text) VALUES ($1, $2)',
                     ["user" + user, message],
                     function() { messagesForUser(user, count+1, callback); });
        }
    }

    function createMessages(user, callback) {
        if (user >= num_users) {
            callback();
        } else {
            messagesForUser(user, 0, function() { createMessages(user+1, callback); })
        }
    }

    db.query("BEGIN TRANSACTION", function() {
        createFollowers(0, function() {
            createMessages (0, function() {
                db.query("COMMIT", function() {
                    process.exit(0);
                });
            });
        });
    });
});

