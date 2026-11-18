const songs = [
  { title: 'Slow Morning', artist: 'Sunday Studio', file: 'slow-morning', alt: 'Abstract orange sun album artwork' },
  { title: 'After the Rain', artist: 'Stillwater', file: 'after-the-rain', alt: 'Abstract blue ripples album artwork' },
  { title: 'Golden Hour', artist: 'Low Tide', file: 'golden-hour', alt: 'Abstract golden landscape album artwork' }
];
const $ = id => document.getElementById(id);
const audio = $('audio');
let selected = 0;
let lastVolume = 0.7;
let playRequest = 0;
const formatTime = seconds => Number.isFinite(seconds) ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}` : '0:00';
function fill(input, percent) { input.style.setProperty('--fill', `${percent}%`); }
function updatePlayback() {
  const playing = !audio.paused && !audio.ended;
  document.querySelector('.player').classList.toggle('is-playing', playing);
  $('play').setAttribute('aria-label', playing ? 'Pause' : 'Play');
  $('play-icon').hidden = playing;
  $('pause-icon').hidden = !playing;
  $('status').textContent = playing ? 'NOW PLAYING' : 'READY WHEN YOU ARE';
}
async function play() {
  const request = ++playRequest;
  $('error').hidden = true;
  try { await audio.play(); }
  catch (error) {
    if (request === playRequest && error.name !== 'AbortError') {
      $('error').textContent = 'This track could not play. Check that its audio file is in assets/audio, then try again.';
      $('error').hidden = false;
    }
  }
}
function updateTime() {
  const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
  $('current-time').textContent = formatTime(audio.currentTime);
  $('duration').textContent = formatTime(duration);
  const percent = duration ? audio.currentTime / duration * 100 : 0;
  $('progress').value = percent;
  $('progress').disabled = !duration;
  $('progress').setAttribute('aria-valuetext', `${formatTime(audio.currentTime)} of ${formatTime(duration)}`);
  fill($('progress'), percent);
}
function selectSong(index, shouldPlay = !audio.paused) {
  ++playRequest;
  selected = (index + songs.length) % songs.length;
  const song = songs[selected];
  audio.src = `assets/audio/${song.file}.wav`;
  $('cover').src = `assets/covers/${song.file}.svg`;
  $('cover').alt = song.alt;
  $('title').textContent = song.title;
  $('artist').textContent = song.artist;
  $('track-number').textContent = `0${selected + 1} / 03`;
  $('error').hidden = true;
  document.querySelectorAll('.track').forEach((button, i) => {
    button.classList.toggle('active', i === selected);
    if (i === selected) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
    button.querySelector('.track-state').textContent = i === selected ? 'SELECTED' : '';
  });
  audio.load();
  updateTime();
  updatePlayback();
  if (shouldPlay) play();
}
$('play').addEventListener('click', () => { if (audio.paused) play(); else { ++playRequest; audio.pause(); } });
$('previous').addEventListener('click', () => selectSong(selected - 1));
$('next').addEventListener('click', () => selectSong(selected + 1));
document.querySelectorAll('.track').forEach(button => button.addEventListener('click', () => selectSong(Number(button.dataset.track), true)));
$('progress').addEventListener('input', event => { if (Number.isFinite(audio.duration)) { audio.currentTime = event.target.value / 100 * audio.duration; updateTime(); } });
function updateVolume() {
  const volume = audio.muted ? 0 : audio.volume;
  $('volume').value = volume;
  $('volume-value').textContent = `${Math.round(volume * 100)}%`;
  $('mute').setAttribute('aria-label', volume === 0 ? 'Unmute' : 'Mute');
  $('mute').setAttribute('aria-pressed', String(volume === 0));
  fill($('volume'), volume * 100);
}
$('volume').addEventListener('input', event => { audio.muted = false; audio.volume = Number(event.target.value); if (audio.volume > 0) lastVolume = audio.volume; });
$('mute').addEventListener('click', () => { if (audio.muted || audio.volume === 0) { audio.muted = false; audio.volume = lastVolume; } else { lastVolume = audio.volume; audio.muted = true; } });
audio.addEventListener('volumechange', updateVolume);
['play', 'pause', 'ended'].forEach(event => audio.addEventListener(event, updatePlayback));
['loadedmetadata', 'durationchange', 'timeupdate', 'emptied'].forEach(event => audio.addEventListener(event, updateTime));
audio.addEventListener('ended', () => selectSong(selected + 1, true));
audio.addEventListener('error', () => { $('error').textContent = 'Audio file not found or unsupported. Check the file path in script.js.'; $('error').hidden = false; });
audio.volume = lastVolume;
updateVolume();
updateTime();
