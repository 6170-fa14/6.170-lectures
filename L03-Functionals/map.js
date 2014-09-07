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

// Another classic functional: build a new array, with elements determined by applying a function to each old element.
function map(arr, f) {
    var output = [];

    for (var i = 0; i < arr.length; ++i) {
        output.push(f(arr[i]));
    }

    return output;
}

// Purely functional processing of the query results (up until we're ready to output)
function search(text, output) {
    // First, let's find a selection of nearby locations matching the search text.
    nearbySearch(text, function(results) {
        results = filter(results, function(result) { return result.vicinity.indexOf("Cambridge") >= 0 });
        results = map(results, function(result) { return result.name });
        foreach(results, output);
    });
}
