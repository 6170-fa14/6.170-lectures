// Create a new star widget DOM node.  Arguments:
// initialValue: optional number 0-4, indicating currently selected star
// onChange: function called with new selection number, whenever it changes
function starWidget(initialValue) {
    // Which star level is selected, if any?
    var selected = Source(initialValue);

    // Which star might we be hovering over?
    var hovering = Source(null);

    // Next, an array of DOM nodes for the 5 stars.
    var stars = Array.create(function(i) {
        return $("<span>")
            .addClass("star star-basic")

            // When the mouse moves over this star, mark it as hovered.
            .mouseenter(function() {
                hovering.set(i);
            })

            // When the mouse leaves a star, "unhover" it.
            .mouseleave(function() {
                hovering.set(null);
            })

            // When the star is clicked, give it the selection.
            .click(function() {
                selected.set(i);
            })

            // Finally, compute the right CSS classes reactively.
            .reactiveCss(read(source(hovering), function(hov) {
                if (hov) {
                    if (i <= hov) {
                        return result("star star-hover");
                    } else {
                        return result("star star-basic");
                    }
                } else {
                    return read(source(selected), function(sel) {
                        if (i <= sel) {
                            return result("star star-on");
                        } else {
                            return result("star star-basic");
                        }
                    });
                }
            }));
    }, 5);

    // Finally, return a <div> containing the stars.
    return {node: $("<div>").append(stars),
            signal: source(selected)};
}
