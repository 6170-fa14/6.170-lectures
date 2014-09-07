// Functional to call a function on every element of an array.
function foreach(arr, f) {
    for (var i = 0; i < arr.length; ++i) {
        f(arr[i]);
    }
}

// Functional to produce a new array, keeping only the elements of the original that pass a test.
function filter(arr, f) {
    var output = [];

    for (var i = 0; i < arr.length; ++i) {
        if (f(arr[i])) {
            output.push(arr[i]);
        }
    }

    return output;
}

// Perform a peculiar kind of search for locations near our lecture room.
// We want to find places matching the search text.
// We call function 'output' to generate lines of result text.
function search(text, output) {
    // First, let's find a selection of nearby locations matching the search text.
    nearbySearch(text, function(results) {
        foreach(filter(results, function(result) { return result.vicinity.indexOf("Cambridge") >= 0 }),
                function(result) {
                    getDetails(result.place_id,
                               function(place) {
                                   // Output a simple summary of the place.
                                   output(place.name + ", at " + place.formatted_address);
                               });
                });
    });
}
