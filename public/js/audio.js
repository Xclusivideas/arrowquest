// Sound effects with error handling
const sounds = {};

// Preload audio with fallbacks
function preloadAudio() {
    const audioFiles = {
        arrowShoot: 'sounds/arrow_shoot.mp3',
        fruitHit: 'sounds/fruit_hit.mp3',
        explosion: 'sounds/explosion.mp3',
        gameOver: 'sounds/game_over.mp3',
        backgroundMusic: 'sounds/background_music.mp3',
        score: 'sounds/score.mp3'
    };
    
    // Create dummy audio for fallback
    const dummyAudio = {
        play: function() { return Promise.resolve(); },
        pause: function() {},
        currentTime: 0,
        loop: false,
        volume: 1
    };
    
    // Try to load each sound, use dummy if fails
    for (const [key, path] of Object.entries(audioFiles)) {
        try {
            const audio = new Audio();
            
            // Add error handling
            audio.onerror = function() {
                console.log(`Failed to load audio: ${path}`);
                sounds[key] = dummyAudio;
                updateDebugPanel(`Audio load failed: ${key}`);
            };
            
            // Set source after adding error handler
            audio.src = path;
            sounds[key] = audio;
            
            // Attempt to load
            audio.load();
        } catch (e) {
            console.log(`Error creating audio: ${e.message}`);
            sounds[key] = dummyAudio;
            updateDebugPanel(`Audio creation failed: ${key}`);
        }
    }
    
    // Set up background music
    if (sounds.backgroundMusic !== dummyAudio) {
        sounds.backgroundMusic.loop = true;
        sounds.backgroundMusic.volume = 0.5;
    }
}

// Safe audio play function
function playSound(soundName) {
    if (!audioEnabled || !sounds[soundName]) return Promise.resolve();
    
    try {
        sounds[soundName].currentTime = 0;
        return sounds[soundName].play().catch(e => {
            console.log(`Audio play failed: ${e.message}`);
            updateDebugPanel(`Audio play failed: ${soundName}`);
            return Promise.resolve();
        });
    } catch (e) {
        console.log(`Error playing sound: ${e.message}`);
        updateDebugPanel(`Audio error: ${soundName}`);
        return Promise.resolve();
    }
}

// Start background music (will be called when game starts)
function startBackgroundMusic() {
    playSound('backgroundMusic');
}

// Update debug panel
function updateDebugPanel(error = null) {
    if (error) {
        lastError = error;
        const lastErrorElement = document.getElementById('last-error');
        if (lastErrorElement) {
            lastErrorElement.textContent = error;
        }
    }
    
    // Update object count
    const objectCount = arrows.length + fruits.length + bombs.length + 
                       particles.length + scorePopups.length;
    const objectCountElement = document.getElementById('object-count');
    if (objectCountElement) {
        objectCountElement.textContent = objectCount;
    }
    
    // Estimate memory usage (very rough approximation)
    const memoryEstimate = Math.round(objectCount * 0.1);
    const memoryUsageElement = document.getElementById('memory-usage');
    if (memoryUsageElement) {
        memoryUsageElement.textContent = memoryEstimate;
    }
}

// Calculate and update FPS
function updateFPS(timestamp) {
    if (!lastFrameTime) {
        lastFrameTime = timestamp;
        return;
    }
    
    const deltaTime = timestamp - lastFrameTime;
    lastFrameTime = timestamp;
    
    if (deltaTime > 0) {
        const fps = 1000 / deltaTime;
        fpsValues.push(fps);
        
        // Keep only last 60 values
        if (fpsValues.length > 60) {
            fpsValues.shift();
        }
        
        // Update FPS display every 500ms
        frameCount++;
        if (timestamp - lastFpsUpdate > 500) {
            const avgFps = Math.round(
                fpsValues.reduce((sum, value) => sum + value, 0) / fpsValues.length
            );
            const fpsElement = document.getElementById('fps');
            if (fpsElement) {
                fpsElement.textContent = avgFps;
            }
            lastFpsUpdate = timestamp;
            frameCount = 0;
        }
    }
}
