// A slightly less trivial search function
function search(text, output) {
    output("Hold on.  I'm busy.");

    // Ask to have a function run 3000 milliseconds from now.
    window.setTimeout(function() {
        output("OK, you wanted to search for '" + text + "', right?");
    }, 3000);
}
