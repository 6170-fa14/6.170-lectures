// Miscellaneous support code for Lecture 4

// Functional to create a new length-'count' array by calling a function that many times
Array.create = function(f, count) {
    var arr = [];

    for (var i = 0; i < count; ++i) {
        arr.push(f());
    }

    return arr;
}

// Call a function on every data value in an array, in order.
Array.prototype.each = function(f) {
    for (var i = 0; i < this.length; i += 1) {
        f(this[i]);
    }
};

// Step through an array in order, using a function to combine elements,
// beginning with an initial accumulator.
Array.prototype.reduce = function(f, acc) {
    this.each(function(x) { acc = f(x, acc); });
    return acc;
};


////// Main animation workhorse for the demo

// This function returns an animation (DOM element) for a given widget,
// advancing to a new frame every 'period' milliseconds, for an input object
// with fields 'widget' and 'period'.
// See widgets.js for documentation on the object format of widgets.
// Details of this function are intentionally not explained, because they're
// orthogonal to the focus of this lecture.

function animation(args) {
    var paused = false, suspendedTick = null;

    function ticker() {
        window.setTimeout(function() {
            function doTick() {
                suspendedTick = null;
                args.widget.tick();
                if (!args.widget.isDone()) { ticker(); }
            }

            if (paused) {
                suspendedTick = doTick;
            } else {
                doTick();
            }
        }, args.period);
    };

    window.onkeypress = function() {
        if (paused) {
            paused = false;
            args.widget.unpause();
            if (suspendedTick) suspendedTick();
        } else {
            paused = true;
            args.widget.pause();
        }
    };

    ticker();
    return args.widget.getElement();
}
