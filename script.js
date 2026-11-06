document.addEventListener("DOMContentLoaded", function() {
    let enteredPasscode = "";
    const correctPasscode = "1725";

    // Live Clock & Date Update
    function updateClock() {
        const now = new Date();
        
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        hours = hours % 12 || 12;
        
        const clockEl = document.getElementById('clock');
        const dateEl = document.getElementById('date');

        if (clockEl) clockEl.innerText = `${hours}:${minutes}`;
        if (dateEl) {
            const options = { weekday: 'short', day: 'numeric', month: 'short' };
            dateEl.innerText = now.toLocaleDateString('en-US', options);
        }

        const appClockEl = document.getElementById('appClock');
        if (appClockEl) {
            appClockEl.innerText = `${hours}:${minutes}:${seconds}`;
        }

        const calendarTodayEl = document.getElementById('calendarToday');
        if (calendarTodayEl) {
            calendarTodayEl.innerText = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        }
    }

    setInterval(updateClock, 1000);
    updateClock();

    // Reveal Passcode keypad from Lock Screen
    window.revealPasscode = function() {
        const wallLayer = document.getElementById('lockWallpaperLayer');
        const passLayer = document.getElementById('passcodeLayer');
        
        if (wallLayer && passLayer) {
            wallLayer.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease';
            wallLayer.style.transform = 'translateY(-30px)';
            wallLayer.style.opacity = '0';
            passLayer.classList.add('active');
        }
    };

    // Cancel back to Lock Screen
    window.cancelPasscode = function() {
        const wallLayer = document.getElementById('lockWallpaperLayer');
        const passLayer = document.getElementById('passcodeLayer');
        
        if (wallLayer && passLayer) {
            passLayer.classList.remove('active');
            wallLayer.style.transform = 'translateY(0px)';
            wallLayer.style.opacity = '1';
        }
        
        enteredPasscode = "";
        updateDots();
        const errorMsgEl = document.getElementById('errorMsg');
        if (errorMsgEl) errorMsgEl.innerText = "";
    };

    // Interactive Swipe Up Gesture
    let startY = 0;
    const screenEl = document.getElementById('lockScreen');

    if (screenEl) {
        screenEl.addEventListener('touchstart', (e) => {
            const wallLayer = document.getElementById('lockWallpaperLayer');
            if (wallLayer && wallLayer.classList.contains('active')) {
                startY = e.touches[0].clientY;
            }
        });

        screenEl.addEventListener('touchmove', (e) => {
            const wallLayer = document.getElementById('lockWallpaperLayer');
            if (wallLayer && wallLayer.classList.contains('active')) {
                let currentY = e.touches[0].clientY;
                let diff = startY - currentY;
                if (diff > 0) {
                    wallLayer.style.transition = 'none';
                    wallLayer.style.transform = `translateY(-${Math.min(diff, 150)}px)`;
                }
            }
        });

        screenEl.addEventListener('touchend', (e) => {
            const wallLayer = document.getElementById('lockWallpaperLayer');
            if (wallLayer && wallLayer.classList.contains('active')) {
                let endY = e.changedTouches[0].clientY;
                if (startY - endY > 50) {
                    window.revealPasscode();
                } else if (wallLayer) {
                    wallLayer.style.transition = 'transform 0.25s ease';
                    wallLayer.style.transform = 'translateY(0px)';
                }
            }
        });
    }

    // Keypad Passcode Logic
    window.pressKey = function(digit) {
        if (enteredPasscode.length < 4) {
            enteredPasscode += digit;
            updateDots();
            
            if (enteredPasscode.length === 4) {
                setTimeout(verifyPasscode, 200);
            }
        }
    };

    function updateDots() {
        for (let i = 1; i <= 4; i++) {
            const dot = document.getElementById(`dot${i}`);
            if (dot) {
                if (i <= enteredPasscode.length) {
                    dot.classList.add('filled');
                } else {
                    dot.classList.remove('filled');
                }
            }
        }
    }

    function verifyPasscode() {
        const errorMsgEl = document.getElementById('errorMsg');
        if (enteredPasscode === correctPasscode) {
            const lockScreenEl = document.getElementById('lockScreen');
            const homeScreenEl = document.getElementById('homeScreen');
            const wallLayer = document.getElementById('lockWallpaperLayer');
            const passLayer = document.getElementById('passcodeLayer');

            if (lockScreenEl) lockScreenEl.classList.remove('active');
            if (homeScreenEl) homeScreenEl.classList.add('active');
            
            if (wallLayer) {
                wallLayer.style.transform = 'translateY(0px)';
                wallLayer.style.opacity = '1';
            }
            if (passLayer) passLayer.classList.remove('active');
            
            enteredPasscode = "";
            updateDots();
            if (errorMsgEl) errorMsgEl.innerText = "";
        } else {
            if (errorMsgEl) errorMsgEl.innerText = "Incorrect Passcode";
            setTimeout(() => {
                enteredPasscode = "";
                updateDots();
            }, 400);
        }
    }

    // Lock Phone Action
    window.lockPhone = function() {
        document.querySelectorAll('.screen-view').forEach(screen => screen.classList.remove('active'));
        const lockScreenEl = document.getElementById('lockScreen');
        const wallLayer = document.getElementById('lockWallpaperLayer');
        const passLayer = document.getElementById('passcodeLayer');
        const errorMsgEl = document.getElementById('errorMsg');

        if (lockScreenEl) lockScreenEl.classList.add('active');
        if (wallLayer) {
            wallLayer.style.transform = 'translateY(0px)';
            wallLayer.style.opacity = '1';
        }
        if (passLayer) passLayer.classList.remove('active');
        
        enteredPasscode = "";
        updateDots();
        if (errorMsgEl) errorMsgEl.innerText = "";
    };

    // App Navigation
    window.openApp = function(appId) {
        const homeScreenEl = document.getElementById('homeScreen');
        const targetApp = document.getElementById(appId);
        if (homeScreenEl) homeScreenEl.classList.remove('active');
        if (targetApp) targetApp.classList.add('active');
    };

    window.closeApp = function() {
        document.querySelectorAll('.app-fullscreen').forEach(screen => screen.classList.remove('active'));
        const homeScreenEl = document.getElementById('homeScreen');
        if (homeScreenEl) homeScreenEl.classList.add('active');
    };

    // Notes Save Action
    window.saveNote = function() {
        const noteInput = document.getElementById('noteInput');
        if (noteInput && noteInput.value.trim() !== "") {
            alert("Note saved successfully!");
        } else {
            alert("Please write something first.");
        }
    };

    // Photos App Lightbox Modal Functions
    window.openLightbox = function(imageSrc) {
        const lightbox = document.getElementById('photoLightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        if (lightbox && lightboxImg) {
            lightboxImg.src = imageSrc;
            lightbox.style.display = 'flex';
        }
    };

    window.closeLightbox = function() {
        const lightbox = document.getElementById('photoLightbox');
        if (lightbox) {
            lightbox.style.display = 'none';
        }
    };
});
