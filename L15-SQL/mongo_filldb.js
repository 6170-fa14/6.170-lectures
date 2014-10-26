var monk = require('monk');
var connection_string = 'localhost/fritter';

var db = monk(connection_string);

var num_users = 1000;
var each_follows = 20;

function followersForUser(user, count, callback) {
    if (count >= each_follows) {
        callback();
    } else {
        var follow = Math.floor(Math.random() * 1000);
        db.get('followers').insert({follower: "user" + user, followed: "user" + follow},
                                   function() { followersForUser(user, count+1, callback); });
    }
}

function createFollowers(user) {
    if (user < num_users) {
        followersForUser(user, 0, function() { createFollowers(user+1); })
    }
}

createFollowers(0);
