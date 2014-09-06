// Perform a peculiar kind of search for locations near our lecture room.
// We want to find places matching the search text.
// We call function 'output' to generate lines of result text.
function search(text, output) {
    // First, let's find a selection of nearby locations matching the search text.
    nearbySearch(text, function(results) {
        // We'll use this counter to record how many Cambridge-matches we find.
        var numMatches = 0;

        // Now let's loop over considering every result.
        // The functionality is encapsulated in a function, for a reason we'll explain shortly.
        // The function argument tells which index within 'results' to start at.
        function considerFrom(i) {
            // Loop over all indices from 'i' on.
            for (; i < results.length; ++i) {
                // Does this result's address summary contain the text "Cambridge"?
                // We're only interested in Cambridge results!
                if (results[i].vicinity.indexOf("Cambridge") >= 0) {
                    // OK, it matched.  Look up the full details of this place.
                    getDetails(results[i].place_id,
                               function(place) {
                                   // Output a simple summary of the place.
                                   output(place.name + ", at " + place.formatted_address);

                                   // Output how many matches have been found so far.
                                   ++numMatches;
                                   output("Matches so far: " + numMatches);

                                   // Here's the odd part.
                                   // It's this callback's responsibility to continue the loop through results!
                                   // We do so by calling the enclosing function with an incremented counter.
                                   considerFrom(i+1);
                               });

                    // Why did the callback need to continue the loop?
                    // Because we're going to return here, right after initiating a details lookup!
                    // Why would we want to do that?
                    // One reason is to be nice to Google.  The naive approach launches several
                    // simultaneous lookups, when one at a time should be good enough.
                    return;
                }
            }
        }

        // Start the loop from the beginning of the results.
        considerFrom(0);
    });
}
