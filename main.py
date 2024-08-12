# app.py

from fastapi import FastAPI, HTTPException
import requests
import base64
from fastapi.middleware.cors import CORSMiddleware
import os
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)


# Spotify API credentials
SPOTIFY_CLIENT_ID = os.environ.get('SPOTIFY_CLIENT_ID')
SPOTIFY_CLIENT_SECRET = os.environ.get('SPOTIFY_CLIENT_SECRET')

@app.get("/search/{track_name}")
def search_track_by_name(track_name: str):
    spotify_token = get_spotify_token()
    if not spotify_token:
        raise HTTPException(status_code=500, detail="Spotify authentication failed")

    spotify_track = search_spotify_track_by_name(track_name, spotify_token)
    if not spotify_track:
        raise HTTPException(status_code=404, detail="Track not found on Spotify")

    isrc = spotify_track['external_ids'].get('isrc')
    if not isrc:
        raise HTTPException(status_code=404, detail="ISRC not found for the track")

    return {
        "track_name": track_name,
        "spotify_track": spotify_track,
        "isrc": isrc
    }

@app.get("/search_by_isrc/{isrc}")
def search_track_by_isrc(isrc: str):
    spotify_token = get_spotify_token()
    if not spotify_token:
        raise HTTPException(status_code=500, detail="Spotify authentication failed")

    spotify_track = search_spotify_track_by_isrc(isrc, spotify_token)
    if not spotify_track:
        raise HTTPException(status_code=404, detail="Track not found on Spotify using ISRC")

    return {
        "isrc": isrc,
        "spotify_track": spotify_track
    }

def get_spotify_token():
    auth_response = requests.post(
        'https://accounts.spotify.com/api/token',
        data={'grant_type': 'client_credentials'},
        headers={'Authorization': f'Basic {base64.b64encode(f"{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}".encode()).decode()}'}
    )
    if auth_response.status_code == 200:
        return auth_response.json().get('access_token')
    return None

def search_spotify_track_by_name(track_name, token):
    search_url = f'https://api.spotify.com/v1/search?q={track_name}&type=track&limit=1'
    search_response = requests.get(search_url, headers={'Authorization': f'Bearer {token}'})
    if search_response.status_code == 200:
        search_results = search_response.json().get('tracks', {}).get('items')
        if search_results:
            return search_results[0]
    return None

def search_spotify_track_by_isrc(isrc, token):
    search_url = f'https://api.spotify.com/v1/search?q=isrc:{isrc}&type=track&limit=1'
    search_response = requests.get(search_url, headers={'Authorization': f'Bearer {token}'})
    if search_response.status_code == 200:
        search_results = search_response.json().get('tracks', {}).get('items')
        if search_results:
            return search_results[0]
    return None

if __name__ == "__main__":
    import uvicorn


    port = int(os.getenv("PORT", 8000))

    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)