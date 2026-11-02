let enteredPasscode = "";
const correctPasscode = "1725"; // Passcode set to 1725

// Live Clock & Date Update
function updateClock() {
    const now = new Date();
    
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    hours = hours % 12 || 12;
    
    document.getElementById('clock').innerText = `${hours}:${minutes}`;

    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    document.getElementById('date').innerText = now.toLocaleDateString('en-US', options);
}

setInterval(updateClock, 1000);
updateClock();

// Reveal Passcode keypad from Lock Screen with slide-up motion
function revealPasscode() {
    const wallLayer = document.getElementById('lockWallpaperLayer');
    const passLayer = document.getElementById('passcodeLayer');
    
    wallLayer.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease';
    wallLayer.style.transform = 'translateY(-30px)';
    wallLayer.style.opacity = '0';
    
    passLayer.classList.add('active');
}

// Cancel back to Lock Screen Wallpaper
function cancelPasscode() {
    const wallLayer = document.getElementById('lockWallpaperLayer');
    const passLayer = document.getElementById('passcodeLayer');
    
    passLayer.classList.remove('active');
    wallLayer.style.transform = 'translateY(0px)';
    wallLayer.style.opacity = '1';
    
    enteredPasscode = "";
    updateDots();
    document.getElementById('errorMsg').innerText = "";
}

// Interactive Swipe Up Gesture Motion Support
let startY = 0;
const screenEl = document.getElementById('lockScreen');

screenEl.addEventListener('touchstart', (e) => {
    if (document.getElementById('lockWallpaperLayer').classList.contains('active')) {
        startY = e.touches[0].clientY;
    }
});

screenEl.addEventListener('touchmove', (e) => {
    if (document.getElementById('lockWallpaperLayer').classList.contains('active')) {
        let currentY = e.touches[0].clientY;
        let diff = startY - currentY;
        if (diff > 0) {
            let wallLayer = document.getElementById('lockWallpaperLayer');
            wallLayer.style.transition = 'none';
            wallLayer.style.transform = `translateY(-${Math.min(diff, 150)}px)`;
        }
    }
});

screenEl.addEventListener('touchend', (e) => {
    if (document.getElementById('lockWallpaperLayer').classList.contains('active')) {
        let endY = e.changedTouches[0].clientY;
        if (startY - endY > 50) {
            revealPasscode();
        } else {
            let wallLayer = document.getElementById('lockWallpaperLayer');
            wallLayer.style.transition = 'transform 0.25s ease';
            wallLayer.style.transform = 'translateY(0px)';
        }
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
        
        const wallLayer = document.getElementById('lockWallpaperLayer');
        document.getElementById('passcodeLayer').classList.remove('active');
        wallLayer.style.transform = 'translateY(0px)';
        wallLayer.style.opacity = '1';
        
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
    
    const wallLayer = document.getElementById('lockWallpaperLayer');
    document.getElementById('passcodeLayer').classList.remove('active');
    wallLayer.style.transform = 'translateY(0px)';
    wallLayer.style.opacity = '1';
    
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
