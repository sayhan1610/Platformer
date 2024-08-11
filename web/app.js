document.getElementById('searchButton').addEventListener('click', function () {
    const query = document.getElementById('searchInput').value.trim();
    const isrcPattern = /^[A-Z]{2}-[A-Z0-9]{3}-\d{2}-\d{5}$/;

    if (isrcPattern.test(query)) {
        searchByISRC(query);
    } else {
        searchByName(query);
    }
});

function searchByName(trackName) {
    fetch(`http://127.0.0.1:8000/search/${trackName}`)
    .then(response => response.json())
    .then(data => displayResult(data))
    .catch(error => displayError(error));

}

function searchByISRC(isrc) {
    fetch(`https://127.0.0.1:8000/search_by_isrc/${isrc}`)
        .then(response => response.json())
        .then(data => displayResult(data))
        .catch(error => displayError(error));
}

function displayResult(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <div class="result-item">
            <h3>${data.spotify_track.name} by ${data.spotify_track.artists.map(artist => artist.name).join(', ')}</h3>
            <p><strong>ISRC:</strong> ${data.isrc}</p>
            <p><strong>Album:</strong> ${data.spotify_track.album.name}</p>
            <p><strong>Preview:</strong> <a href="${data.spotify_track.preview_url}" target="_blank">Listen</a></p>
        </div>
    `;
}

function displayError(error) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<p>Error: ${error.message}</p>`;
}
