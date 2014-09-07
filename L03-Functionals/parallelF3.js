// Functional to call a function on every element of an array.
Array.prototype.foreach = function(f) {
    for (var i = 0; i < this.length; ++i) {
        f(this[i]);
    }
};

// Functional to produce a new array, keeping only the elements of the original that pass a test.
Array.prototype.filter = function(f) {
    var output = [];

    for (var i = 0; i < this.length; ++i) {
        if (f(this[i])) {
            output.push(this[i]);
        }
    }

    return output;
};

// Another classic functional: build a new array, with elements determined by applying a function to each old element.
Array.prototype.map = function(f) {
    var output = [];

    for (var i = 0; i < this.length; ++i) {
        output.push(f(this[i]));
    }

    return output;
}

// Here's a funky variant of map(), designed to work with callbacks.
// - Function f is called in order for all the array elements,
//   passing it a callback that should be called with the new value,
//   when ready.
// - Function callback is called with the new array when _all_ of its
//   positions are filled in.
Array.prototype.mapAsync = function(f, callback) {
    var output = [], finished = 0, that = this;

    for (var i = 0; i < this.length; ++i) {
        (function(i) {
            f(that[i], function(value) {
                output[i] = value;
                ++finished;
                if (finished == that.length) {
                    callback(output);
                }
            })
        })(i);
    }
}

// Now for a funky filter()!
Array.prototype.filterAsync = function(f, callback) {
    var keepIt = [], finished = 0, that = this;

    for (var i = 0; i < this.length; ++i) {
        (function(i) {
            f(that[i], function(value) {
                keepIt[i] = value;
                ++finished;
                if (finished == that.length) {
                    var output = [];

                    for (i = 0; i < that.length; ++i) {
                        if (keepIt[i]) {
                            output.push(that[i]);
                        }
                    }

                    callback(output);
                }
            })
        })(i);
    }
}

// An asynchronous functional pipeline
function search(text, output) {
    // First, let's find a selection of nearby locations matching the search text.
    nearbySearch(text, function(results) {
        results.filterAsync(function(result, valueIs) { getDetails(result.place_id,
                                                                   function(place) {
                                                                       valueIs(place.vicinity.indexOf("Cambridge") >= 0)
                                                                   }) },
                            function(results) {
                                results.mapAsync(function(result, valueIs) { getDetails(result.place_id,
                                                                                        function(place) {
                                                                                            valueIs(place.name + ", at " + place.formatted_address)
                                                                                        }) },
                                                 function(values) { values.foreach(output); })
                            })
    });
}
