function search(text, output) {
    nearbySearch(text, function(results) {
        function considerFrom(i) {
            for (; i < results.length; ++i) {
                if (results[i].vicinity.indexOf("Cambridge") >= 0) {
                    getDetails(results[i].place_id,
                               function(place) {
                                   output(place.name + " = " + place.formatted_address);
                                   considerFrom(i+1);
                               });
                    return;
                }
            }
        }

        considerFrom(0);
    });
}
