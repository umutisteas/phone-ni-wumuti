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

// Notes App Data & Logic (Grouped by your exact requested dates)
let defaultNotes = [
    {
        id: 1,
        title: "Finals/survived 😣",
        body: "Today i went on a date with rui after our finals. And he looked So beautiful—extra beautiful that my heart ached :((( god i am soo happy to have him. i love you baby I LOVE YOU SO MUCHH",
        dateGroup: "Yesterday",
        shortDate: "11/06"
    },
    {
        id: 2,
        title: "Ph pride!🏳️‍🌈 puta gastos",
        body: "Pride flag - 35 mahal tangina\nPerfume - 7,500 secured😻\nBoots - ok n\nClips\nPressed on nails kay hyun - 500\nCap na nakaw kay haru\nPambleach ng buhok - 260",
        dateGroup: "06/18/26",
        shortDate: "06/18"
    },
    {
        id: 3,
        title: ".",
        body: "Suka\nToyo\nBawang\nSibuyas\nSprite\nBaboy\nManok\nPatatas\nDahon ng laurel\nPaminta\nMantika",
        dateGroup: "08/16/26",
        shortDate: "08/16"
    },
    {
        id: 4,
        title: "Happy Anniversary, Baby </3",
        body: "Happy 4th anniversary to the person who holds my whole heart. When I look back, it feels both like time has flown by in the blink of an eye and like we've lived a whole lifetime of beautiful moments together —from our spontaneous laughs to the quiet, ordinary days that somehow became my absolute favorites. Thank you for being my constant, for the safety I find in your arms, and for making even the hardest days feel lighter just by being in my corner; loving you is the easiest and most natural thing I have ever known.\n\nFour years is a wonderful milestone, but looking ahead, it feels like we are still just getting started. I am so endlessly grateful for the history we've built, and I am even more excited for all the unspoken tomorrows, future adventures, and quiet mornings waiting for us. Here's to four years of us, to the love we share, and to a lifetime more of growing side by side.\n\nMahal na mahal kita",
        dateGroup: "08/27/26",
        shortDate: "08/27"
    },
    {
        id: 5,
        title: "I love rui",
        body: "I love rui\nI love my baby\nI love my dearest\nI love my home\nI love my beautiful sweet baby\n\nI miss my boyfriend diko machat lako signal #fml 😢😢😢 hate it here",
        dateGroup: "10/04/26",
        shortDate: "10/04"
    },
    {
        id: 6,
        title: "i love filipino films",
        body: "- Idily\n- ekstra\n- cleaners\n- bekikang\n- every vice ganda film\n- call center girl\n- filipiñana\n- cleaners\n- pamilya ordinaryo\n- sunshine\n- respeto",
        dateGroup: "10/04/26",
        shortDate: "10/04"
    }
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
                        <span class="note-item-snippet">${note.body ? note.body.replace(/\n/g, ' ') : "No additional text"}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `).join('');
}

function createNewNote() {
    const newNote = {
        id: Date.now(),
        title: "",
        body: "",
        dateGroup: "Yesterday",
        shortDate: "11/07"
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
