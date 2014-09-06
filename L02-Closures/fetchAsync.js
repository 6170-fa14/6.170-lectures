// Let's contact the local server (asynchronously) to handle this search query.
function search(text, output) {
    fetchUrlAsync("http://localhost:8080/?" + escape(text), output);
}
