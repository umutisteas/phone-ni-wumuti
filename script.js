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

// Lock Screen Swipe & Click Gesture Handler (Improved for mobile responsiveness)
const lockScreenEl = document.getElementById('lockScreen');
if (lockScreenEl) {
    let touchStartY = 0;

    lockScreenEl.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    lockScreenEl.addEventListener('touchend', (e) => {
        let touchEndY = e.changedTouches[0].clientY;
        if (touchStartY - touchEndY > 20 || Math.abs(touchStartY - touchEndY) < 10) {
            triggerPasscodeLayer();
        }
    });

    lockScreenEl.addEventListener('click', () => {
        triggerPasscodeLayer();
    });
}

function triggerPasscodeLayer() {
    const wallpaperLayer = document.getElementById('lockWallpaperLayer');
    const passcodeLayer = document.getElementById('passcodeLayer');
    
    if (wallpaperLayer) wallpaperLayer.classList.remove('active');
    if (passcodeLayer) passcodeLayer.classList.add('active');
}

// Spotify Playlist Database (Cover Photos & Track Info)
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
function handleSpotifyScroll() {
    const scrollArea = document.getElementById('spotifyScrollArea');
    const stickyBar = document.getElementById('spotifyStickyBar');
    const findSortContainer = document.getElementById('findSortContainer');
    if (!scrollArea) return;
    const scrollTop = scrollArea.scrollTop;

    if (stickyBar) {
        if (scrollTop > 180) stickyBar.classList.add('visible');
        else stickyBar.classList.remove('visible');
    }

    if (findSortContainer) {
        if (scrollTop > 60) findSortContainer.classList.add('visible');
        else findSortContainer.classList.remove('visible');
    }
}

function expandSpotifyPlayer() {
    document.getElementById('spotifyMainView').classList.remove('active');
    document.getElementById('spotifyPlayerView').classList.add('active');
}

function minimizeSpotifyPlayer() {
    document.getElementById('spotifyPlayerView').classList.remove('active');
    document.getElementById('spotifyMainView').classList.add('active');
}

// Notes App Data & Logic
let defaultNotes = [
    { id: 1, title: "Finals/survived 😣", body: "Today i went on a date with rui after our finals. And he looked So beautiful—extra beautiful that my heart ached :((( god i am soo happy to have him. i love you baby I LOVE YOU SO MUCHH", dateGroup: "Yesterday", shortDate: "11/06" },
    { id: 2, title: "Ph pride!🏳️‍🌈 puta gastos", body: "Pride flag - 35 mahal tangina\nPerfume - 7,500 secured😻\nBoots - ok n\nClips\nPressed on nails kay hyun - 500\nCap na nakaw kay haru\nPambleach ng buhok - 260", dateGroup: "06/18/26", shortDate: "06/18" },
    { id: 3, title: ".", body: "Suka\nToyo\nBawang\nSibuyas\nSprite\nBaboy\nManok\nPatatas\nDahon ng laurel\nPaminta\nMantika", dateGroup: "08/16/26", shortDate: "08/16" },
    { id: 4, title: "Happy Anniversary, Baby </3", body: "Happy 4th anniversary to the person who holds my whole heart. When I look back, it feels both like time has flown by in the blink of an eye and like we've lived a whole lifetime of beautiful moments together —from our spontaneous laughs to the quiet, ordinary days that somehow became my absolute favorites. Thank you for being my constant, for the safety I find in your arms, and for making even the hardest days feel lighter just by being in my corner; loving you is the easiest and most natural thing I have ever known.\n\nFour years is a wonderful milestone, but looking ahead, it feels like we are still just getting started. I am so endlessly grateful for the history we've built, and I am even more excited for all the unspoken tomorrows, future adventures, and quiet mornings waiting for us. Here's to four years of us, to the love we share, and to a lifetime more of growing side by side.\n\nMahal na mahal kita", dateGroup: "08/27/26", shortDate: "08/27" },
    { id: 5, title: "I love rui", body: "I love rui\nI love my baby\nI love my dearest\nI love my home\nI love my beautiful sweet baby\n\nI miss my boyfriend diko machat lako signal #fml 😢😢😢 hate it here", dateGroup: "10/04/26", shortDate: "10/04" },
    { id: 6, title: "i love filipino films", body: "- Idily\n- ekstra\n- cleaners\n- bekikang\n- every vice ganda film\n- call center girl\n- filipiñana\n- cleaners\n- pamilya ordinaryo\n- sunshine\n- respeto", dateGroup: "10/04/26", shortDate: "10/04" }
];

let notesList = JSON.parse(localStorage.getItem('ios_notes_data')) || defaultNotes;
let activeNoteId = null;

function renderNotesList() {
    const container = document.getElementById('notesListContainer');
    const countEl = document.getElementById('notesCount');
    if (!container) return;

    countEl.innerText = `${notesList.length} Notes`;
    const groups = {};
    notesList.forEach(note => {
        const groupKey = note.dateGroup || "Previous 30 Days";
        if (!groups[groupKey]) groups[groupKey] = [];
        groups[groupKey].push(note);
    });

    container.innerHTML = Object.keys(groups).map(groupName => `
        <div class="notes-section-group">
            <h3 class="notes-section-title">${groupName}</h3>
            ${groups[groupName].map(note => `
                <div class="note-item-row" onclick="openNote(${note.id})">
                    <h4 class="note-item-title">${note.title || "New Note"}</h4>
                    <div class="note-item-preview-wrapper">
                        <span class="note-item-date">${note.shortDate || "11/07"}</span>
                        <span class="note-item-snippet">${note.body ? note.body.replace(/\n/g, ' ') : "No text"}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `).join('');
}

function createNewNote() {
    const newNote = { id: Date.now(), title: "", body: "", dateGroup: "Yesterday", shortDate: "11/07" };
    notesList.unshift(newNote);
    localStorage.setItem('ios_notes_data', JSON.stringify(notesList));
    openNote(newNote.id);
}

function openNote(id) {
    activeNoteId = id;
    const note = notesList.find(n => n.id === id);
    if (!note) return;
    document.getElementById('noteTitleInput').value = note.title;
    document.getElementById('noteBodyInput').value = note.body;
    document.getElementById('activeNoteDate').innerText = `${note.dateGroup} at 4:52 PM`;
    document.getElementById('notesMainView').classList.remove('active');
    document.getElementById('notesEditorView').classList.add('active');
}

function returnToNotesList() {
    document.getElementById('notesEditorView').classList.remove('active');
    document.getElementById('notesMainView').classList.add('active');
    renderNotesList();
}

function autoSaveCurrentNote() {
    if (!activeNoteId) return;
    const note = notesList.find(n => n.id === activeNoteId);
    if (!note) return;
    note.title = document.getElementById('noteTitleInput').value;
    note.body = document.getElementById('noteBodyInput').value;
    localStorage.setItem('ios_notes_data', JSON.stringify(notesList));
}

// Photos Setup
const photoList = [
    "IMG_1617.jpeg", "IMG_1618.jpeg", "IMG_1619.jpeg", "IMG_1620.jpeg",
    "IMG_1621.jpeg", "IMG_1622.jpeg", "IMG_1623.jpeg", "IMG_1624.jpeg",
    "IMG_0986.jpeg", "IMG_1626.jpeg", "IMG_1627.jpeg", "IMG_1628.jpeg",
    "IMG_1629.jpeg", "IMG_1630.jpeg", "IMG_1631.jpeg", "IMG_1632.jpeg",
    "IMG_1633.jpeg", "IMG_1634.jpeg", "IMG_1635.jpeg"
];
let currentIndex = 0;

window.addEventListener('DOMContentLoaded', () => {
    const gridEl = document.getElementById('photoGrid');
    const thumbEl = document.getElementById('lightboxThumbnails');

    if (gridEl) {
        gridEl.innerHTML = photoList.map((src, index) => `
            <div class="photo-item"><img src="${src}" alt="Photo" onclick="openLightboxIndex(${index})"></div>
        `).join('');
    }

    if (thumbEl) {
        thumbEl.innerHTML = photoList.map((src, index) => `
            <img src="${src}" class="lightbox-thumb ${index === 0 ? 'active' : ''}" onclick="openLightboxIndex(${index})" id="thumb-${index}">
        `).join('');
    }

    renderNotesList();
    renderSpotifyTracklist();
    updatePlayerUI();
});

function openLightboxIndex(index) {
    currentIndex = index;
    const modal = document.getElementById('photoLightbox');
    document.getElementById('lightboxImg').src = photoList[currentIndex];
    modal.style.display = 'flex';
}

function closeLightbox() {
    document.getElementById('photoLightbox').style.display = 'none';
}
