// Create a new star widget DOM node.  Arguments:
function starWidget() {
    // Which star level is selected, if any?
    var selected = Source();

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
                if (hov !== null) {
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
            signal: read(source(selected), function(n) { return result(n >= 0 ? n+1 : 0); })};
}


// A derived widget: a sequence of stars widgets, with label text on each.
// Returns a node and a signal of the _highest_ selection.
function starsWidget(labels) {
    var stars = labels.map(function(label) {
        var star = starWidget();
        // Notice how pleasant it is to use the existing widget here as a simple building block. :)

        return {node: $("<div>")
                .append(star.node)
                .append($("<span>").text(label)),
                signal: star.signal};
    });

    return {node: $("<div>").append(stars.map(function(star) {
        return star.node;
    })),
            signal: stars.reduce(function(star, sig) {
                return read(star.signal, function(cur) {
                    return read(sig, function(prev) {
                        return result(Math.max(prev, cur));
                    });
                });
            }, result(0))}
}
