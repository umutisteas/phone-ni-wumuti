// Change your 4-digit passcode here:
const CORRECT_PASSCODE = "1234"; 
let enteredPasscode = "";

// Handle Keypad Press
function pressKey(number) {
    if (enteredPasscode.length < 4) {
        enteredPasscode += number;
        updateDots();
        
        if (enteredPasscode.length === 4) {
            setTimeout(checkPasscode, 200);
        }
    }
}

// Update Dots Visual
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

// Verify Passcode
function checkPasscode() {
    const errorMsg = document.getElementById('errorMsg');
    
    if (enteredPasscode === CORRECT_PASSCODE) {
        errorMsg.textContent = "";
        enteredPasscode = "";
        updateDots();
        
        document.getElementById('lockScreen').classList.remove('active');
        document.getElementById('homeScreen').classList.add('active');
    } else {
        errorMsg.textContent = "Incorrect Passcode";
        enteredPasscode = "";
        updateDots();
    }
}

// Clear Button (Backspace)
function clearPasscode() {
    enteredPasscode = enteredPasscode.slice(0, -1);
    updateDots();
    document.getElementById('errorMsg').textContent = "";
}

// Relock Phone
function lockPhone() {
    const screens = document.querySelectorAll('.screen-view');
    screens.forEach(screen => screen.classList.remove('active'));
    
    document.getElementById('lockScreen').classList.add('active');
}

// App Navigation
function openApp(appId) {
    const screens = document.querySelectorAll('.screen-view');
    screens.forEach(screen => screen.classList.remove('active'));

    document.getElementById(appId).classList.add('active');
}

function goHome() {
    const screens = document.querySelectorAll('.screen-view');
    screens.forEach(screen => screen.classList.remove('active'));

    document.getElementById('homeScreen').classList.add('active');
}

// Live Clock for Lock Screen
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    const timeString = `${hours}:${minutes}`;
    const clockElem = document.getElementById('timeDisplay');
    if (clockElem) {
        clockElem.textContent = timeString;
    }
}
setInterval(updateClock, 1000);
updateClock();

// App Features (Instagram Likes, Retweets, Notes)
let isLiked = false;
function toggleLike() {
    const likeCount = document.getElementById('likeCount');
    let count = parseInt(likeCount.textContent);
    if (!isLiked) {
        likeCount.textContent = count + 1;
        isLiked = true;
    } else {
        likeCount.textContent = count - 1;
        isLiked = false;
    }
}

let retweeted = false;
function retweet() {
    const retweetCount = document.getElementById('retweetCount');
    let count = parseInt(retweetCount.textContent);
    if (!retweeted) {
        retweetCount.textContent = count + 1;
        retweeted = true;
    }
}

function saveNote() {
    const status = document.getElementById('saveStatus');
    status.textContent = "Saved to Notes!";
    status.style.color = "#16a34a";
}
