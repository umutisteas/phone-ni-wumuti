let enteredPasscode = "";
const correctPasscode = "1725"; // Updated passcode

// Live Clock & Date Update
function updateClock() {
    const now = new Date();
    
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    hours = hours % 12 || 12;
    document.getElementById('clock').innerText = `${hours}:${minutes}`;

    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('date').innerText = now.toLocaleDateString('en-US', options);
}

setInterval(updateClock, 1000);
updateClock();

// Reveal Passcode keypad from Lock Screen
function revealPasscode() {
    document.getElementById('lockWallpaperLayer').classList.remove('active');
    document.getElementById('passcodeLayer').classList.add('active');
}

// Cancel back to Lock Screen Wallpaper
function cancelPasscode() {
    document.getElementById('passcodeLayer').classList.remove('active');
    document.getElementById('lockWallpaperLayer').classList.add('active');
    enteredPasscode = "";
    updateDots();
    document.getElementById('errorMsg').innerText = "";
}

// Swipe Up Gesture Support
let startY = 0;
const lockLayer = document.getElementById('lockWallpaperLayer');

lockLayer.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
});

lockLayer.addEventListener('touchend', (e) => {
    let endY = e.changedTouches[0].clientY;
    if (startY - endY > 40) { // Swiped up
        revealPasscode();
    }
});

// Keypad Passcode Logic
function pressKey(digit) {
    if (enteredPasscode.length < 4) {
        enteredPasscode += digit;
        updateDots();
        
        if (enteredPasscode.length === 4) {
            setTimeout(verifyPasscode, 200);
        }
    }
}

function deleteKey() {
    if (enteredPasscode.length > 0) {
        enteredPasscode = enteredPasscode.slice(0, -1);
        updateDots();
        document.getElementById('errorMsg').innerText = "";
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
        // Correct Passcode -> Go to Home Screen
        document.getElementById('lockScreen').classList.remove('active');
        document.getElementById('homeScreen').classList.add('active');
        
        // Reset lock layers for next time
        document.getElementById('passcodeLayer').classList.remove('active');
        document.getElementById('lockWallpaperLayer').classList.add('active');
        enteredPasscode = "";
        updateDots();
        document.getElementById('errorMsg').innerText = "";
    } else {
        // Incorrect Passcode -> Show Error & Reset
        document.getElementById('errorMsg').innerText = "Incorrect Passcode";
        setTimeout(() => {
            enteredPasscode = "";
            updateDots();
        }, 400);
    }
}

// Lock Phone Action
function lockPhone() {
    document.querySelectorAll('.screen-view').forEach(screen => screen.classList.remove('active'));
    document.getElementById('lockScreen').classList.add('active');
    document.getElementById('passcodeLayer').classList.remove('active');
    document.getElementById('lockWallpaperLayer').classList.add('active');
    enteredPasscode = "";
    updateDots();
    document.getElementById('errorMsg').innerText = "";
}

// App Navigation
function openApp(appId) {
    document.getElementById('homeScreen').classList.remove('active');
    document.getElementById(appId).classList.add('active');
}

function closeApp() {
    document.querySelectorAll('.app-fullscreen').forEach(screen => screen.classList.remove('active'));
    document.getElementById('homeScreen').classList.add('active');
}

// Notes Save Action
function saveNote() {
    const noteText = document.getElementById('noteInput').value;
    if (noteText.trim() !== "") {
        alert("Note saved successfully!");
    } else {
        alert("Please write something first.");
    }
}
