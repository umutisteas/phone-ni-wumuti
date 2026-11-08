// Time & Date Widget Update
function updateClock() {
    const now = new Date();
    
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    hours = hours % 12 || 12;
    const timeString = `${hours}:${minutes}`;
    
    const clockEl = document.getElementById('clock');
    if (clockEl) clockEl.innerText = timeString;

    const appClockEl = document.getElementById('appClock');
    if (appClockEl) appClockEl.innerText = now.toLocaleTimeString();

    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);
    const dateEl = document.getElementById('date');
    if (dateEl) dateEl.innerText = dateString;
}
setInterval(updateClock, 1000);
updateClock();

// App Navigation
let currentAppId = null;

function openApp(appId) {
    document.getElementById('lockScreen').classList.remove('active');
    document.getElementById('homeScreen').classList.remove('active');

    const apps = document.querySelectorAll('.app-fullscreen');
    apps.forEach(app => app.classList.remove('active'));

    const targetApp = document.getElementById(appId);
    if (targetApp) {
        targetApp.classList.add('active');
        currentAppId = appId;
    }
}

function closeApp() {
    if (currentAppId) {
        const targetApp = document.getElementById(currentAppId);
        if (targetApp) targetApp.classList.remove('active');
    }
    currentAppId = null;
    document.getElementById('homeScreen').classList.add('active');
}

function lockPhone() {
    const apps = document.querySelectorAll('.app-fullscreen');
    apps.forEach(app => app.classList.remove('active'));
    currentAppId = null;

    document.getElementById('homeScreen').classList.remove('active');
    document.getElementById('lockScreen').classList.add('active');
    
    document.getElementById('passcodeLayer').classList.remove('active');
    document.getElementById('lockWallpaperLayer').classList.add('active');
}

// Passcode Simulation Logic ("1725")
let enteredPasscode = "";
const correctPasscode = "1725";

function pressKey(num) {
    if (enteredPasscode.length < 4) {
        enteredPasscode += num;
        updateDots();
        
        if (enteredPasscode.length === 4) {
            setTimeout(verifyPasscode, 150);
        }
    }
}

function updateDots() {
    for (let i = 1; i <= 4; i++) {
        const dot = document.getElementById(`dot${i}`);
        if (i <= enteredPasscode.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    }
}

function verifyPasscode() {
    if (enteredPasscode === correctPasscode) {
        document.getElementById('lockScreen').classList.remove('active');
        document.getElementById('homeScreen').classList.add('active');
        cancelPasscode();
    } else {
        document.getElementById('errorMsg').innerText = "Incorrect Passcode";
        setTimeout(() => {
            enteredPasscode = "";
            updateDots();
            document.getElementById('errorMsg').innerText = "";
        }, 500);
    }
}

function cancelPasscode() {
    enteredPasscode = "";
    updateDots();
    document.getElementById('errorMsg').innerText = "";
    document.getElementById('passcodeLayer').classList.remove('active');
    document.getElementById('lockWallpaperLayer').classList.add('active');
}

// Lock Screen Swipe & Click Gesture Handler
const lockWallpaperLayer = document.getElementById('lockWallpaperLayer');
if (lockWallpaperLayer) {
    let touchStartY = 0;

    lockWallpaperLayer.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    lockWallpaperLayer.addEventListener('touchend', (e) => {
        let touchEndY = e.changedTouches[0].clientY;
        if (touchStartY - touchEndY > 20 || Math.abs(touchStartY - touchEndY) < 10) {
            triggerPasscodeLayer();
        }
    });

    lockWallpaperLayer.addEventListener('click', () => {
        triggerPasscodeLayer();
    });
}

function triggerPasscodeLayer() {
    document.getElementById('lockWallpaperLayer').classList.remove('active');
    document.getElementById('passcodeLayer').classList.add('active');
}

// Spotify Playlist Database (Cover Photos Only)
const spotifyPlaylist = [
    { id: 0, title: "Alas Dose", artist: "Cup of Joe", duration: "3:45", cover: "./IMG_1758.jpeg" },
    { id: 1, title: "Dalangin", artist: "Sugarcane", duration: "4:12", cover: "./IMG_1759.jpeg" },
    { id: 2, title: "Bukod-Tangi", artist: "Cup of Joe", duration: "3:50", cover: "./IMG_1760.jpeg" },
    { id: 3, title: "Panaginip Lang", artist: "Alex Gonzaga", duration: "3:15", cover: "./IMG_1761.jpeg" },
    { id: 4, title: "Kusapiling", artist: "Anthony Meneses", duration: "4:05", cover: "./IMG_1762.jpeg" },
    { id: 5, title: "Estranghero", artist: "Cup of Joe", duration: "3:30", cover: "./IMG_1763.jpeg" },
    { id: 6, title: "Mata sa Mata", artist: "7th", duration: "3:55", cover: "./IMG_1764.jpeg" },
    { id: 7, title: "Gitara", artist: "Parokya Ni Edgar", duration: "4:20", cover: "./IMG_1765.jpeg" },
    { id: 8, title: "Pag-Ibig", artist: "Yeng Constantino", duration: "3:40", cover: "./IMG_1766.png" },
    { id: 9, title: "Passenger Seat", artist: "Stephen Speaks", duration: "3:38", cover: "./IMG_1767.jpeg" }
];

let currentTrackIndex = 0;

function renderSpotifyTracklist() {
    const container = document.getElementById('spotifyTracklist');
    if (!container) return;

    container.innerHTML = spotifyPlaylist.map((song, index) => `
        <div class="track-row" onclick="selectTrack(${index})">
            <img src="${song.cover}" class="track-thumb" alt="Cover" onerror="this.src='https://placehold.co/50x50/333/fff?text=🎵'">
            <div class="track-info">
                <span class="track-title" style="color: ${index === currentTrackIndex ? '#1ed760' : '#ffffff'}">${song.title}</span>
                <span class="track-artist">${song.artist}</span>
            </div>
            <button class="track-options-btn" onclick="event.stopPropagation()">•••</button>
        </div>
    `).join('');
}

function selectTrack(index) {
    currentTrackIndex = index;
    renderSpotifyTracklist();
    updatePlayerUI();
}

function togglePlayPause() {
    // Visual toggle only since audio is removed
    updatePlayerUI();
}

function nextSong() {
    currentTrackIndex = (currentTrackIndex + 1) % spotifyPlaylist.length;
    renderSpotifyTracklist();
    updatePlayerUI();
}

function prevSong() {
    currentTrackIndex = (currentTrackIndex - 1 + spotifyPlaylist.length) % spotifyPlaylist.length;
    renderSpotifyTracklist();
    updatePlayerUI();
}

function updatePlayerUI() {
    const song = spotifyPlaylist[currentTrackIndex];
    
    document.getElementById('miniTitle').innerText = song.title;
    document.getElementById('miniArtist').innerText = song.artist;
    document.getElementById('miniCoverImg').src = song.cover;
    
    document.getElementById('playerTitle').innerText = song.title;
    document.getElementById('playerArtist').innerText = song.artist;
    document.getElementById('playerCoverImg').src = song.cover;
    document.getElementById('durationLabel').innerText = song.duration;
}

// Scroll Handler for Spotify Header Fading & Find on Page bar
function handle
