const base_url = 'https://platformer-q202.onrender.com';
let spotifyUri = '';
const colorThief = new ColorThief();

function applyTypewriterEffect(element, text) {
    let index = 0;
    element.innerText = '';
    function type() {
        if (index < text.length) {
            element.innerText += text.charAt(index);
            index++;
            setTimeout(type, 50);
        }
    }
    type();
}

function searchTrack() {
    const searchType = document.getElementById('searchType').value;
    const searchInput = document.getElementById('searchInput').value;
    if (!searchInput) {
        alert(`Please enter a ${searchType === 'name' ? 'track name' : 'ISRC'}`);
        return;
    }

    let apiUrl = '';
    if (searchType === 'name') {
        apiUrl = `${base_url}/search/${searchInput}`;
    } else if (searchType === 'isrc') {
        apiUrl = `${base_url}/search_by_isrc/${searchInput}`;
    }

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);

            if (data && data.spotify_track) {
                const trackInfo = document.getElementById('trackInfo');
                trackInfo.classList.remove('hidden');
                trackInfo.style.display = 'block';

                spotifyUri = data.spotify_track.uri;

                applyTypewriterEffect(document.getElementById('trackTitle'), data.spotify_track.name);
                applyTypewriterEffect(document.getElementById('albumType'), data.spotify_track.album.album_type);
                applyTypewriterEffect(document.getElementById('artists'), data.spotify_track.artists.map(artist => artist.name).join(', '));
                applyTypewriterEffect(document.getElementById('trackId'), data.spotify_track.id);
                applyTypewriterEffect(document.getElementById('releaseDate'), data.spotify_track.album.release_date);
                applyTypewriterEffect(document.getElementById('isrc'), data.spotify_track.external_ids.isrc);
                applyTypewriterEffect(document.getElementById('explicit'), data.spotify_track.explicit ? 'Yes' : 'No');
                applyTypewriterEffect(document.getElementById('duration'), `${(data.spotify_track.duration_ms / 60000).toFixed(2)} minutes`);
                applyTypewriterEffect(document.getElementById('popularity'), data.spotify_track.popularity);

                const previewAudio = document.getElementById('previewAudio');
                if (data.spotify_track.preview_url) {
                    previewAudio.src = data.spotify_track.preview_url;
                    previewAudio.style.display = 'block';
                } else {
                    previewAudio.style.display = 'none';
                }

                const albumCover = document.getElementById('albumCover');
                albumCover.src = data.spotify_track.album.images[0].url;
                albumCover.onload = () => {
                    const dominantColor = colorThief.getColor(albumCover);
                    applyDynamicColors(dominantColor);
                };
            } else {
                alert('Track not found');
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function applyDynamicColors(color) {
    const borderColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    const shadowColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.6)`;
    const textColor = getContrastingColor(color);
    const hoverColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`;
    const container = document.querySelector('.container');
    const buttons = document.querySelectorAll('.button');
    const selectButton = document.getElementById('searchType');
    const searchButton = document.querySelector('.search-box button');


    container.style.borderColor = borderColor;
    container.style.boxShadow = `0px 0px 15px 5px rgba(60, 60, 60, 0.2),
                                 0 0 20px 10px ${shadowColor},
                                 0 0 30px 15px rgba(103, 103, 103, 0.1),
                                 0 0 40px 20px ${shadowColor}`;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        .container::before {
            background: linear-gradient(
                45deg,
                ${borderColor},
                ${hoverColor}
            );
        }
        .container::after {
            background: linear-gradient(
                45deg,
                ${borderColor},
                ${hoverColor}
            );
        }
        @keyframes flicker {
            0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
                box-shadow: 0px 0px 15px 5px rgba(60, 60, 60, 0.2),
                            0 0 20px 10px ${shadowColor},
                            0 0 30px 15px rgba(103, 103, 103, 0.1),
                            0 0 40px 20px ${shadowColor};
            }
            20%, 22%, 24%, 55% {
                box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, 0.5);
            }
        }
    `;
    document.head.appendChild(styleSheet);


    buttons.forEach(button => {
        button.style.backgroundColor = borderColor;
        button.style.color = textColor;
        button.style.boxShadow = `0px 8px 15px rgba(0, 0, 0, 0.1)`;
    });

    selectButton.style.backgroundColor = borderColor;
    selectButton.style.color = textColor;
    searchButton.style.backgroundColor = borderColor;
    searchButton.style.color = textColor;

  
    const styleHover = `
    #searchType:hover {
        background-color: ${hoverColor} !important;
    }
    .search-box button:hover {
        background-color: ${hoverColor} !important;
    }
    .button:hover {
        background-color: ${hoverColor} !important;
        box-shadow: 0px 15px 20px ${hoverColor} !important;
        color: ${textColor} !important;
        transform: translateY(-7px);
    }
    .button:active {
        transform: translateY(-1px);
    }
    `;

    const styleSheetHover = document.createElement("style");
    styleSheetHover.type = "text/css";
    styleSheetHover.innerText = styleHover;
    document.head.appendChild(styleSheetHover);
}

function getContrastingColor(color) {
    const brightness = 0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2];
    return brightness < 128 ? '#FFF' : '#000';
}

function copyToClipboard() {
    navigator.clipboard.writeText(spotifyUri)
        .then(() => {
            alert('Spotify URI copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
        });
}

function openOnSpotify() {
    window.open(spotifyUri, '_blank');
}

function togglePlay() {
    const audio = document.getElementById('previewAudio');
    const playButton = document.getElementById('playButton');
  
    if (audio.paused) {
      audio.play();
      playButton.textContent = 'Pause'; 
    } else {
      audio.pause();
      playButton.textContent = 'Play'; 
    }
  }
  
 
  document.getElementById('previewAudio').addEventListener('play', () => {
    document.getElementById('playButton').textContent = '||';
  });
  document.getElementById('previewAudio').addEventListener('pause', () => {
    document.getElementById('playButton').textContent = '▶';
  });
  
   
function updatePlayButtonColor(color) {
    const playButton = document.getElementById('playButton');
    const buttonColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    const hoverColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`;
    
    playButton.style.backgroundColor = buttonColor;
    playButton.style.color = getContrastingColor(color);
    
    playButton.addEventListener('mouseover', () => {
        playButton.style.backgroundColor = hoverColor;
    });
    
    playButton.addEventListener('mouseout', () => {
        playButton.style.backgroundColor = buttonColor;
    });
}

function togglePlay() {
    const audio = document.getElementById('previewAudio');
    const playButton = document.getElementById('playButton');
  
    if (audio.paused) {
        audio.play();
        playButton.textContent = '||';
    } else {
        audio.pause();
        playButton.textContent = '▶'; 
    }
}


document.getElementById('albumCover').addEventListener('load', () => {
    const dominantColor = colorThief.getColor(document.getElementById('albumCover'));
    updatePlayButtonColor(dominantColor);
});
