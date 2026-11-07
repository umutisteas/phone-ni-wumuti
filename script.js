// Time & Date Widget Update
function updateClock() {
    const now = new Date();
    
    // Time format
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    hours = hours % 12 || 12; // 12-hour format
    const timeString = `${hours}:${minutes}`;
    
    const clockEl = document.getElementById('clock');
    if (clockEl) clockEl.innerText = timeString;

    const appClockEl = document.getElementById('appClock');
    if (appClockEl) appClockEl.innerText = now.toLocaleTimeString();

    // Date format
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
    // Hide lock screen / home screen
    document.getElementById('lockScreen').classList.remove('active');
    document.getElementById('homeScreen').classList.remove('active');

    // Hide all apps first
    const apps = document.querySelectorAll('.app-fullscreen');
    apps.forEach(app => app.classList.remove('active'));

    // Open target app
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
    // Close any open apps
    const apps = document.querySelectorAll('.app-fullscreen');
    apps.forEach(app => app.classList.remove('active'));
    currentAppId = null;

    document.getElementById('homeScreen').classList.remove('active');
    document.getElementById('lockScreen').classList.add('active');
    
    // Reset to Lock Wallpaper layer
    document.getElementById('passcodeLayer').classList.remove('active');
    document.getElementById('lockWallpaperLayer').classList.add('active');
}

// Passcode Simulation Logic
let enteredPasscode = "";
const correctPasscode = "1234"; // Change passcode here if needed

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
        // Success: Unlock to Home Screen
        document.getElementById('lockScreen').classList.remove('active');
        document.getElementById('homeScreen').classList.add('active');
        cancelPasscode();
    } else {
        // Incorrect Passcode
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

// Swipe up / Tap on lock screen wallpaper to trigger passcode keypad layer
document.getElementById('lockWallpaperLayer').addEventListener('click', () => {
    document.getElementById('lockWallpaperLayer').classList.remove('active');
    document.getElementById('passcodeLayer').classList.add('active');
});

// Lightbox Photo Viewer Functions
function openLightbox(imgSrc) {
    const modal = document.getElementById('photoLightbox');
    const modalImg = document.getElementById('lightboxImg');
    modalImg.src = imgSrc;
    modal.style.display = 'flex';
}

function closeLightbox() {
    const modal = document.getElementById('photoLightbox');
    modal.style.display = 'none';
}

// Notes persistence
function saveNote() {
    const noteText = document.getElementById('noteInput').value;
    localStorage.setItem('iphone_saved_note', noteText);
    alert('Note saved successfully!');
}

window.addEventListener('DOMContentLoaded', () => {
    const savedNote = localStorage.getItem('iphone_saved_note');
    if (savedNote) {
        document.getElementById('noteInput').value = savedNote;
    }
});
