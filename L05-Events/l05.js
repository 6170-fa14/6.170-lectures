// Miscellaneous support code for Lecture 5

// Functional to create a new length-'count' array,
// by calling a function that many times, each time passing it the current index.
Array.create = function(f, count) {
    var arr = [];

    for (var i = 0; i < count; ++i) {
        arr.push(f(i));
    }

    return arr;
}

// Call a function on every data value in an array, in order.
Array.prototype.each = function(f) {
    for (var i = 0; i < this.length; i += 1) {
        f(this[i]);
    }
};

// Call a function on every index and data value in an array, in order.
Array.prototype.eachi = function(f) {
    for (var i = 0; i < this.length; i += 1) {
        f(i, this[i]);
    }
};
