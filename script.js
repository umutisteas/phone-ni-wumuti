// Time & Date Widget Update
function updateClock() {
    const now = new Date();
    
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    hours = hours % 12 || 12; // 12-hour format
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

// Notes App Data & Logic
let notesList = JSON.parse(localStorage.getItem('ios_notes_data')) || [
    {
        id: 1,
        title: "Custom iOS 26 UI setup ✨",
        body: "Building an interactive, responsive iOS-style mobile phone web prototype on GitHub featuring lockscreen, glass-morphic passcode keypad, and photos app lightbox.",
        date: "Yesterday"
    }
];

let activeNoteId = null;

function renderNotesList() {
    const container = document.getElementById('notesListContainer');
    const countEl = document.getElementById('notesCount');
    if (!container) return;

    countEl.innerText = `${notesList.length} Note${notesList.length === 1 ? '' : 's'}`;

    container.innerHTML = notesList.map(note => `
        <div class="note-item-row" onclick="openNote(${note.id})">
            <h4 class="note-item-title">${note.title || "New Note"}</h4>
            <div class="note-item-preview-wrapper">
                <span class="note-item-date">${note.date}</span>
                <span class="note-item-snippet">${note.body || "No additional text"}</span>
            </div>
        </div>
    `).join('');
}

function createNewNote() {
    const newNote = {
        id: Date.now(),
        title: "",
        body: "",
        date: "Just now"
    };
    notesList.unshift(newNote);
    saveNotesStorage();
    openNote(newNote.id);
}

function openNote(id) {
    activeNoteId = id;
    const note = notesList.find(n => n.id === id);
    if (!note) return;

    document.getElementById('noteTitleInput').value = note.title;
    document.getElementById('noteBodyInput').value = note.body;
    document.getElementById('activeNoteDate').innerText = note.date;

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
    saveNotesStorage();
}

function saveNotesStorage() {
    localStorage.setItem('ios_notes_data', JSON.stringify(notesList));
}

// Photo List & Lightbox Functions
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
    setupEdgeSwipeBack();
    setupLightboxPhotoSwiping();
});

function openLightboxIndex(index) {
    currentIndex = index;
    const modal = document.getElementById('photoLightbox');
    const modalImg = document.getElementById('lightboxImg');
    modalImg.src = photoList[currentIndex];
    modal.style.display = 'flex';
    updateThumbnails();
}

function openLightbox(imgSrc) {
    const foundIdx = photoList.indexOf(imgSrc);
    openLightboxIndex(foundIdx !== -1 ? foundIdx : 0);
}

function closeLightbox() {
    document.getElementById('photoLightbox').style.display = 'none';
}

function nextPhoto() {
    currentIndex = (currentIndex + 1) % photoList.length;
    animatePhotoTransition('left');
}

function prevPhoto() {
    currentIndex = (currentIndex - 1 + photoList.length) % photoList.length;
    animatePhotoTransition('right');
}

function animatePhotoTransition(direction) {
    const img = document.getElementById('lightboxImg');
    img.style.opacity = '0';
    img.style.transform = direction === 'left' ? 'translateX(-30px)' : 'translateX(30px)';
    
    setTimeout(() => {
        img.src = photoList[currentIndex];
        img.style.transform = direction === 'left' ? 'translateX(30px)' : 'translateX(-30px)';
        
        requestAnimationFrame(() => {
            img.style.opacity = '1';
            img.style.transform = 'translateX(0)';
        });
        updateThumbnails();
    }, 180);
}

function updateThumbnails() {
    photoList.forEach((_, idx) => {
        const thumb = document.getElementById(`thumb-${idx}`);
        if (thumb) {
            if (idx === currentIndex) {
                thumb.classList.add('active');
                thumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            } else {
                thumb.classList.remove('active');
            }
        }
    });
}

// 1. Photo Lightbox In-App Swiping
function setupLightboxPhotoSwiping() {
    const swipeArea = document.getElementById('lightboxSwipeArea');
    if (!swipeArea) return;

    let startX = 0;
    let endX = 0;

    swipeArea.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    swipeArea.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;
    }, { passive: true });

    swipeArea.addEventListener('touchend', () => {
        const frameRect = document.querySelector('.phone-frame').getBoundingClientRect();
        const relativeStartX = startX - frameRect.left;

        if (relativeStartX > 35) {
            let diff = startX - endX;
            if (Math.abs(diff) > 40 && endX !== 0) {
                if (diff > 0) {
                    nextPhoto();
                } else {
                    prevPhoto();
                }
            }
        }
        startX = 0;
        endX = 0;
    });
}

// 2. Strict Edge Swipe Right To Go Back
function setupEdgeSwipeBack() {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        endX = startX;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;
        endY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', () => {
        const frame = document.querySelector('.phone-frame');
        const frameRect = frame ? frame.getBoundingClientRect() : { left: 0 };
        const relativeStartX = startX - frameRect.left;

        const deltaX = endX - startX;
        const deltaY = Math.abs(endY - startY);

        if (relativeStartX <= 35 && deltaX > 50 && deltaY < 60) {
            const lightbox = document.getElementById('photoLightbox');
            const notesEditor = document.getElementById('notesEditorView');
            
            if (lightbox && lightbox.style.display === 'flex') {
                closeLightbox();
            } else if (notesEditor && notesEditor.classList.contains('active')) {
                returnToNotesList();
            } else if (currentAppId) {
                closeApp();
            }
        }
    });
}
