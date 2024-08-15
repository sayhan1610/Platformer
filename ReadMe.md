# Platformer - Spotify Track Search Application

# [Website](https://platformerweb.netlify.app/)

## Overview

Platformer is a web application that allows users to search for Spotify tracks by either track name or ISRC (International Standard Recording Code). The app leverages the Spotify API to retrieve track information, including album details, artists, duration, and more. The interface is built to be dynamic and visually appealing, with features such as color themes that adapt based on the album cover art.

## Features

- **Search by Track Name**: Enter a track name to fetch details about the track from Spotify.
- **Search by ISRC**: Retrieve track information using the ISRC code.
- **Track Information Display**: View details such as album type, artists, release date, ISRC, explicit content, and more.
- **Album Cover & Dynamic Colors**: The app dynamically adjusts its color scheme based on the album cover of the searched track.
- **Spotify URI Copying**: Easily copy the Spotify URI of a track to your clipboard.
- **Open on Spotify**: Quickly open the track on Spotify directly from the app.
- **Audio Preview**: Listen to a 30-second preview of the track (if available).
- **Responsive Design**: A visually responsive design that looks great on different devices.

## Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: HTML, CSS, JavaScript
- **APIs**: Spotify Web API
- **Other Libraries**:
  - [Color Thief](https://lokeshdhakar.com/projects/color-thief/): Extract dominant colors from album art images.
  - CORS Middleware for cross-origin requests.

## Installation

### Prerequisites

- Python 3.7+
- Spotify Developer Account (for API credentials)

### Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/sayhan1610/platformer.git
   cd platformer
   ```

2. **Create a virtual environment**:

   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   Create a `.env` file in the root directory and add your Spotify API credentials:

   ```bash
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   ```

5. **Run the server**:

   ```bash
   uvicorn app:app --reload
   ```

6. **Open the application**:
   Navigate to `http://127.0.0.1:8000` in your web browser.

## Usage

- **Search for a Track**:

  - Select whether you want to search by track name or ISRC.
  - Enter the track name or ISRC into the search box.
  - Click on the "Search" button.
  - View the track details that are dynamically displayed.

- **Copy and Share**:

  - Use the "Copy Spotify URI" button to copy the track's Spotify URI.
  - Use the "Open on Spotify" button to view the track on Spotify.

- **Audio Preview**:
  - If a preview URL is available, you can play a 30-second snippet directly from the app.

## Contributing

If you'd like to contribute, feel free to fork the repository, make your changes, and submit a pull request. Make sure to follow the standard coding guidelines and format your code before submitting.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Special thanks to [Spotify](https://developer.spotify.com/) for providing an excellent API to build upon.
- [Color Thief](https://lokeshdhakar.com/projects/color-thief/) for helping make the UI more dynamic and visually engaging.
