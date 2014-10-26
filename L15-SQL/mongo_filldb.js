var monk = require('monk');
var connection_string = 'localhost/fritter';

var db = monk(connection_string);

var num_users = 1000;
var each_follows = 20;
var each_messages = 10;

function followersForUser(user, count, callback) {
    if (count >= each_follows) {
        callback();
    } else {
        var follow = Math.floor(Math.random() * 1000);
        db.get('followers').insert({follower: "user" + user, followed: "user" + follow},
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
        db.get('messages').insert({user: "user" + user, text: message},
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

createFollowers(0, function() { createMessages (0, function() { process.exit(0); }); });
