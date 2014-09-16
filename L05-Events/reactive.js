// Simple (too simple!) implementation of "reactive" GUIs in JavaScript.

// Basic terminology:
// SOURCE: A mutable cell storing data, with tracking of who is interested in updates to it
// SIGNAL: A time-varying value, dependent on the latest data of certain sources

//// Implementation of sources:

// A source is an object with these methods:
// get(): Returns current data value
// set(): Change data value.
// addSubscriber(): Register a new function interested in data changes;
//                  it will be called later with new data values.

function Source(data) {
    var subscribers = [];

    return {
        get: function() {
            return data;
        },

        addSubscriber: function(f) {
            subscribers.push(f);
        },

        set: function(newData) {
            data = newData;
            subscribers.each(function(f) { f(data); });
        }
    }
}


//// Implementation of signals

// A signal is just a function expecting to be passed a callback.
// Every time the signal's value changes (including on initialization),
// call the callback with the new value.

// A constant-valued signal
function result(value) {
    return function(callback) {
        callback(value);
    };
}

// A signal standing for a read-only view of a source
function source(s) {
    return function(callback) {
        callback(s.get());
        s.addSubscriber(callback);
    };
}

// A kind of pipeline: take values produced by the signal,
// pass them to the function 'f', then act like the signal it returns.
function read(signal, f) {
    return function(callback) {
        signal(function(x) {
            f(x)(callback);
        });
    };
}

function reactiveText(signal) {
    var node = $("<span></span>");
    signal(function(value) { $(node).text(value); });
    return node;
}


/// A few test cases (different signals to use with reactiveText())

var constant = result("Test");

function sum(s1, s2) {
    return read(s1, function(v1) {
        return read(s2, function(v2) {
            return result(v1 + v2);
        });
    });
}

var concated = sum(constant, result("!"));

var counter = Source(0);

var counterIs = read(source(counter), function(n) {
    return result("Counter is: " + n);
});

var counter2 = Source(0);

var counter2Is = read(source(counter2), function(n) {
    return result("Counter2 is: " + n);
});

var sumIs = sum(source(counter), source(counter2));


/// Postscript: The implementation here is naive in an important way.
// An essential kind of "garbage collection" is missing, which will cause
// trouble for long-running programs creating many short-lived signals.
// Do you see the problem?
