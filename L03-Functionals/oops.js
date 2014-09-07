// This file gives an example of how NOT to mix functionals and callbacks!

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

// Purely functional processing of the query results (up until we're ready to output)
function search(text, output) {
    // First, let's find a selection of nearby locations matching the search text.
    nearbySearch(text, function(results) {
        // Here comes a pipeline of functional calls, equivalent to the code of the prior demo!

        results
        .filter(function(result) { return result.vicinity.indexOf("Cambridge") >= 0 })
        .map(function(result) { getDetails(result.place_id,
                                           function(place) {
                                               return place.name + ", at " + place.formatted_address;
                                           });
                              })
        .foreach(output);

        // It doesn't actually work to use getDetails() like above.
        // The callback's return value is just ignored!
    });
}
