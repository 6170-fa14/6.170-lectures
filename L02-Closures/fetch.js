// Let's contact the local server to handle this search query.
function search(text, output) {
    output(fetchUrl("http://localhost:8080/?" + escape(text)));
}
