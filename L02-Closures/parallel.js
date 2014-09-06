// Perform a peculiar kind of search for locations near our lecture room.
// We want to find places matching the search text.
// We call function 'output' to generate lines of result text.
function search(text, output) {
    // First, let's find a selection of nearby locations matching the search text.
    nearbySearch(text, function(results) {
        // Now let's loop over consider every result.
        for (var i = 0; i < results.length; ++i) {
            // Does this result's address summary contain the text "Cambridge"?
            // We're only interested in Cambridge results!
            if (results[i].vicinity.indexOf("Cambridge") >= 0) {
                // OK, it matched.  Look up the full details of this place.
                getDetails(results[i].place_id,
                           function(place) {
                               // Output a simple summary of the place.
                               output(place.name + ", at " + place.formatted_address);
                           });
            }
        }
    });
}
