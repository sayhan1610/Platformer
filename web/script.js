let spotifyUri = '';

function searchTrack() {
    const searchType = document.getElementById('searchType').value;
    const searchInput = document.getElementById('searchInput').value;
    if (!searchInput) {
        alert(`Please enter a ${searchType === 'name' ? 'track name' : 'ISRC'}`);
        return;
    }

    let apiUrl = '';
    if (searchType === 'name') {
        apiUrl = `http://127.0.0.1:8000/search/${searchInput}`;
    } else if (searchType === 'isrc') {
        apiUrl = `http://127.0.0.1:8000/search_by_isrc/${searchInput}`;
    }

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);  // Debugging: Log the received data

            if (data && data.spotify_track) {
                const trackInfo = document.getElementById('trackInfo');
                trackInfo.classList.remove('hidden');  // Ensure trackInfo is shown
                trackInfo.style.display = 'block';  // Ensure it's block display

                spotifyUri = data.spotify_track.uri;  // Store the URI in a variable

                document.getElementById('trackTitle').innerText = data.spotify_track.name;
                document.getElementById('albumType').innerText = data.spotify_track.album.album_type;
                document.getElementById('artists').innerText = data.spotify_track.artists.map(artist => artist.name).join(', ');
                document.getElementById('trackId').innerText = data.spotify_track.id;
                document.getElementById('releaseDate').innerText = data.spotify_track.album.release_date;
                document.getElementById('isrc').innerText = data.isrc;
                document.getElementById('explicit').innerText = data.spotify_track.explicit ? 'Yes' : 'No';
                document.getElementById('duration').innerText = `${Math.floor(data.spotify_track.duration_ms / 60000)}:${((data.spotify_track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}`;
                document.getElementById('popularity').innerText = data.spotify_track.popularity;
                document.getElementById('previewAudio').src = data.spotify_track.preview_url;
                document.getElementById('albumCover').src = data.spotify_track.album.images[0].url;
            } else {
                alert('Track not found');
            }
        })
        .catch(error => {
            console.error('Error fetching track:', error);
            alert('Error fetching track. Please try again later.');
        });
}

function copyToClipboard() {
    navigator.clipboard.writeText(spotifyUri).then(() => {
        alert('Spotify URI copied to clipboard!');
    });
}

function openOnSpotify() {
    const spotifyUrl = spotifyUri.replace('spotify:track:', 'https://open.spotify.com/track/');
    window.open(spotifyUrl, '_blank');
}
