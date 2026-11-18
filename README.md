# Soft Sound

A simple music player made with HTML, CSS, and JavaScript. No installation, account, or internet connection required.

## Open the website

Double-click `index.html` to open it in your browser. Click the large play button to start listening.

If you prefer a local server, run this command from this folder:

```sh
python3 -m http.server 8000
```

Then visit http://localhost:8000. Press Ctrl+C in the terminal to stop the server.

## Controls

- Play/pause, previous, and next control playback. Previous and next wrap around the three tracks and preserve the playing/paused state.
- Click a song in the list to select and play it. When a song ends, the next one plays automatically.
- Drag or click the progress bar to seek.
- Drag the volume slider to change volume; click the speaker to mute or restore volume.
- All controls support keyboard navigation with Tab; sliders support arrow keys.

## Replace the demo music and covers

Three original, synthesized 32-second instrumental demo WAV files are included locally in `assets/audio/`. Replace them with your own songs using the same filenames, or update the paths in `script.js` and the initial audio `src` in `index.html`. For MP3s, change the `.wav` extensions in those paths to `.mp3`.

Replace the square SVG covers in `assets/covers/`, or update the image paths in `script.js` and `index.html` to use JPG or PNG files. Edit the `songs` array in `script.js` for titles, artist names, and image descriptions. Also update the initial title, artist, and song-list labels in `index.html`.

Files: `index.html` (page), `styles.css` (design), `script.js` (player behavior), `assets/` (local music and artwork).
