// Miscellaneous support code for Lecture 4

Array.create = function(f, count) {
    var arr = [];

    for (var i = 0; i < count; ++i) {
        arr.push(f());
    }

    return arr;
}

Array.prototype.each = function(f) {
    for (var i = 0; i < this.length; i += 1) {
        f(this[i]);
    }
};

Array.prototype.eachi = function(f) {
    for (var i = 0; i < this.length; i += 1) {
        f(i, this[i]);
    }
};
