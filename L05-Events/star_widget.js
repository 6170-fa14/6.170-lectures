// Create a new star widget DOM node.  Arguments:
// initialValue: optional number 0-4, indicating currently selected star
// onChange: function called with new selection number, whenever it changes
function starWidget(initialValue, onChange) {
    // Which star level is selected, if any?
    var selected = initialValue;

    // Next, an array of DOM nodes for the 5 stars.
    var stars = Array.create(function(i) {
        return $("<span>")

            // Add basic star styling (see next recitation for more detail on CSS classes!)
            .addClass("star star-basic")

            // When the mouse moves over this star, turn it and all earlier stars red.
            .mouseenter(function() {
                stars.eachi(function(j, star) {
                    if (j <= i) {
                        $(star).removeClass()
                            .addClass("star star-hover");
                    } else {
                        $(star).removeClass()
                            .addClass("star star-basic");
                    }
                });
            })

            // When the mouse leaves a star, revert to default styling, based on current selection.
            .mouseleave(function() {
                defaultClasses();
                // See definition of this helper function below.
            })

            // When the star is clicked, give it the selection.
            .click(function() {
                selected = i;
                if (onChange) {
                    onChange(selected);
                }
                defaultClasses();
            })
    }, 5);

    // Default formatting: stars at or below the selection are yellow.
    var defaultClasses = function() {
        stars.eachi(function(i, star) {
            if (i <= selected) {
                $(star).removeClass()
                    .addClass("star star-on");
            } else {
                $(star).removeClass()
                    .addClass("star star-basic");
            }
        });
    };

    // Finally, return a <div> containing the stars.
    return $("<div>").append(stars);
}
