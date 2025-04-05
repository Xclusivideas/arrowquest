
// Main game logic and loop

// Initialize game
function initGame() {
    try {
        // Reset game state
        score = 0;
        arrowsLeft = 20;
        applesDropped = 0;
        gameOver = false;
        hitCombo = 0;
        lastHitTime = 0;
        timeLeft = 60;
        bombExplosionInProgress = false;
        arrows = [];
        fruits = [];
        bombs = [];
        particles = [];
        scorePopups = [];
        spearApples = [];
        archerDirection = 'right';
        
        // Reset key states
        keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
            Enter: false
        };
        
        // Create archer
        archer = createArcher();
        
        // Initialize background elements
        initBackground();
        
        // Update UI
        updateScoreDisplay();
        updateArrowsDisplay();
        updateApplesDisplay();
        updateTimeDisplay();
        
        // Initialize title character offsets for animation
        initTitleAnimation();
        
        // Start game timer
        startGameTimer();
        
        // Start background music immediately when game starts
        startBackgroundMusic();
        
        // Set game as started
        gameStarted = true;
        
        // Start game loop
        if (!gameLoopRunning) {
            gameLoopRunning = true;
            requestAnimationFrame(gameLoop);
        }
        
        // Update debug panel
        updateDebugPanel();
    } catch (e) {
        console.error("Initialization error:", e);
        updateDebugPanel(`Init error: ${e.message}`);
    }
}

// Initialize title animation
function initTitleAnimation() {
    // Get the title text
    const titleElement = document.querySelector('h1');
    if (!titleElement) return;
    
    const titleText = titleElement.textContent || "Arrow Quest";
    
    // Clear previous content
    titleElement.innerHTML = '';
    titleCharacterOffsets = [];
    
    // Create spans for each character with individual animation
    for (let i = 0; i < titleText.length; i++) {
        const span = document.createElement('span');
        span.textContent = titleText[i];
        span.style.display = 'inline-block';
        span.style.position = 'relative';
        titleElement.appendChild(span);
        
        // Initialize with random offset phase
        titleCharacterOffsets.push({
            phase: Math.random() * Math.PI * 2,
            speed: 0.05 + Math.random() * 0.03
        });
    }
}

// End game
function endGame() {
    if (gameOver) return; // Prevent multiple calls
    
    gameOver = true;
    
    // Stop background music and play game over sound
    if (sounds.backgroundMusic) sounds.backgroundMusic.pause();
    playSound('gameOver');
    
    // Add score to leaderboard
    addScoreToLeaderboard(playerName, score);
    
    // Render leaderboard
    renderLeaderboard();
    
    // Show game over screen
    showGameOver();
}

// Main game loop
let lastTime = 0;

function gameLoop(timestamp) {
    try {
        // Update FPS counter
        updateFPS(timestamp);
        
        if (!lastTime) lastTime = timestamp;
        const deltaTime = (timestamp - lastTime) / 1000;
        lastTime = timestamp;
        
        // Clear canvas
        ctx.fillStyle = '#000033'; // Dark blue background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        drawBackground();
        
        if (!gameOver && !bombExplosionInProgress) {
            // Update and draw game objects
            updateGame(deltaTime);
            
            // Spawn new fruits and bombs with rate limiting
            if (Math.random() < fruitSpawnRate * deltaTime * 60 && fruits.length + bombs.length < 10) {
                spawnFruitOrBomb();
            }
            
            // Check combo timeout
            if (hitCombo > 0 && timestamp - lastHitTime > comboTimeout) {
                hitCombo = 0;
            }
        }
        
        // Update and draw particles
        updateParticles();
        
        // Update debug panel periodically
        if (frameCount % 30 === 0) {
            updateDebugPanel();
        }
        
        // Process collisions
        if (!gameOver && !bombExplosionInProgress) {
            processArrowFruitCollisions();
            processArrowBombCollisions();
            removeOffscreenObjects();
        }
        
        // Animate title
        animateTitle();
        
        // Request next frame with error handling
        gameLoopRunning = true;
        requestAnimationFrame(gameLoop);
    } catch (e) {
        console.error("Game loop error:", e);
        updateDebugPanel(`Loop error: ${e.message}`);
        
        // Try to recover
        gameLoopRunning = false;
        setTimeout(() => {
            if (!gameLoopRunning) {
                gameLoopRunning = true;
                requestAnimationFrame(gameLoop);
            }
        }, 1000);
    }
}

// Update game state
function updateGame(deltaTime) {
    // Update archer
    archer.update();
    archer.draw();
    
    // Update arrows
    for (let i = arrows.length - 1; i >= 0; i--) {
        arrows[i].update();
        arrows[i].draw();
    }
    
    // Update fruits
    for (let i = fruits.length - 1; i >= 0; i--) {
        fruits[i].update();
        fruits[i].draw();
    }
    
    // Update bombs
    for (let i = bombs.length - 1; i >= 0; i--) {
        bombs[i].update();
        bombs[i].draw();
    }
    
    // Update score popups
    for (let i = scorePopups.length - 1; i >= 0; i--) {
        scorePopups[i].update();
        scorePopups[i].draw();
        
        // Remove faded popups
        if (scorePopups[i].alpha <= 0) {
            scorePopups.splice(i, 1);
        }
    }
}

// Animate the game title
function animateTitle() {
    titleAngle += 0.03;
    
    const titleElement = document.querySelector('h1');
    if (!titleElement) return;
    
    // Get all character spans
    const chars = titleElement.querySelectorAll('span');
    if (chars.length === 0) {
        initTitleAnimation();
        return;
    }
    
    // Animate each character individually
    for (let i = 0; i < chars.length; i++) {
        if (i >= titleCharacterOffsets.length) continue;
        
        // Update phase for this character
        titleCharacterOffsets[i].phase += titleCharacterOffsets[i].speed;
        
        // Calculate vertical position
        const yOffset = Math.sin(titleCharacterOffsets[i].phase) * 5;
        
        // Apply transform with vertical offset
        chars[i].style.transform = `translateY(${yOffset}px)`;
        chars[i].style.transition = 'transform 0.1s ease-in-out';
        
        // Add glow effect
        const glowAmount = 5 + Math.sin(titleAngle + i * 0.3) * 5;
        chars[i].style.textShadow = `0 0 ${glowAmount}px #00ffff`;
    }
}

// Event listeners
window.addEventListener('DOMContentLoaded', () => {
    // Mouse move
    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });
    
    // Click to shoot
    canvas.addEventListener('click', function() {
        shootArrow();
    });
    
    // Touch move for mobile
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        mouseX = touch.clientX - rect.left;
        mouseY = touch.clientY - rect.top;
    });
    
    // Touch start for mobile (shoot)
    canvas.addEventListener('touchstart', function(e) {
        if (!gameOver && !bombExplosionInProgress && arrowsLeft > 0) {
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            mouseX = touch.clientX - rect.left;
            mouseY = touch.clientY - rect.top;
            
            shootArrow();
        }
    });
    
    // Keyboard controls
    window.addEventListener('keydown', function(e) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) {
            keys[e.key] = true;
            e.preventDefault(); // Prevent scrolling
            
            // Shoot arrow on Enter key press
            if (e.key === 'Enter' && !gameOver && !bombExplosionInProgress) {
                shootArrow();
            }
        }
    });
    
    window.addEventListener('keyup', function(e) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) {
            keys[e.key] = false;
        }
    });
    
    // Initialize UI
    initUI();
    
    // Initialize leaderboard
    initLeaderboard();
    
    // Preload audio
    preloadAudio();
});

// Helper function to shoot an arrow - refactored to avoid code duplication
function shootArrow() {
    if (!gameOver && !bombExplosionInProgress && arrowsLeft > 0) {
        // Arrow spawns at archer's position and flies in the direction the archer is facing
        const arrowX = archerDirection === 'right' ? archer.x + 30 : archer.x - 30;
        arrows.push(createArrow(arrowX, archer.y));
        arrowsLeft--;
        updateArrowsDisplay();
        
        // End game if no arrows left
        if (arrowsLeft === 0) {
            setTimeout(endGame, 2000); // Give time for last arrow to potentially hit
        }
    }
}
